"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, X, Loader2, ArrowLeft, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-handler";
import {
  getListingById,
  getImagesByListingId,
  updateListing,
  createListingImage,
  deleteListingImage,
  getAmenity,
  getRoomTypes,
} from "@/app/_actions/listing";
import {
  getProvinces,
  getWards,
} from "@/app/_actions/listing/listing-province-actions";
import { useQuery } from "@tanstack/react-query";
import { CustomDropdown } from "./custom-dropdown";
import Tiptap from "@/app/_components/wysiwyg/tiptap";
import { Badge } from "@/components/ui/badge";

// Helper function to validate image

type ListingImage = {
  id: string;
  imageUrl: string;
};

export function EditListingForm({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [listingImages, setListingImages] = useState<ListingImage[]>([]);

  // Other states (keep as before)
  const [type, setType] = useState<string>("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [roomTypeId, setRoomTypeId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pricePerNight, setPricePerNight] = useState<number>(0);
  const [beds, setBeds] = useState<number>(1);
  const [roomsAvailable, setRoomsAvailable] = useState<number>(0);
  const [provinceId, setProvinceId] = useState<string>("");
  const [wardId, setWardId] = useState<string>("");
  const [provinceOptions, setProvinceOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [wardOptions, setWardOptions] = useState<
    { id: string; name: string }[]
  >([]);

  // Query for amenities
  const { data: amenitiesOptions = [] } = useQuery({
    queryKey: ["amenities"],
    queryFn: getAmenity,
    refetchOnWindowFocus: false,
  });

  // Query for room types
  const { data: roomTypeOptions = [] } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    refetchOnWindowFocus: false,
  });

  // Fetch provinces on mount
  useEffect(() => {
    getProvinces().then(setProvinceOptions);
  }, []);

  // Fetch wards when provinceId changes
  useEffect(() => {
    if (provinceId) {
      getWards(provinceId).then((wards) => {
        setWardOptions(wards);
        // Only keep wardId if it belongs to the selected province
        if (!wards.some((w) => w.id === wardId)) {
          setWardId("");
        }
      });
    } else {
      setWardOptions([]);
      setWardId("");
    }
  }, [provinceId, wardId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listing, images] = await Promise.all([
          getListingById(listingId),
          getImagesByListingId(listingId),
        ]);

        if (listing) {
          setTitle(listing.name || "");
          setType(listing.type || "");
          setAmenities(listing.amenities?.map((a) => a.amenity.id) || []);
          setContent(listing.desc || "");
          setRoomTypeId(listing.roomTypeId || null);
          setImageUrls(listing.imageUrls || []);
          setPricePerNight(listing.pricePerNight || 0);
          setBeds(listing.beds || 1);
          setRoomsAvailable(listing.roomsAvailable || 0);
          setProvinceId(listing.provinceId || "");
          setWardId(listing.wardId || "");
          setThumbnail(listing.thumbnail || null);
        }

        setListingImages(images || []);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId]);

  // THUMBNAIL
  const uploadThumbnail = async (file: File) => {
    setUploading(true);
    try {
      if (thumbnail) {
        await deleteImageFromCloudinary(thumbnail);
      }
      const imageUrl = await uploadImageToCloudinary(file);
      await updateListing(listingId, { thumbnail: imageUrl });
      setThumbnail(imageUrl);
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (err) {
      console.error(err);
      toast.error("Upload thumbnail thất bại");
    } finally {
      setUploading(false);
    }
  };

  const deleteThumbnail = async () => {
    if (!thumbnail) return;
    setUploading(true);
    try {
      await deleteImageFromCloudinary(thumbnail);
      await updateListing(listingId, { thumbnail: "" });
      setThumbnail(null);
      toast.success("Đã xoá thumbnail");
    } catch (err) {
      console.error(err);
      toast.error("Xoá thumbnail thất bại");
    } finally {
      setUploading(false);
    }
  };

  // LISTING IMAGES
  const uploadImages = async (files: FileList) => {
    setUploading(true);
    try {
      const fileArr = Array.from(files);

      const uploads = await Promise.all(
        fileArr.map(async (file) => {
          const imageUrl = await uploadImageToCloudinary(file);
          const img = await createListingImage({
            listingId,
            imageUrl,
          });
          return img;
        })
      );

      setListingImages((prev) => [...prev, ...uploads]);
      toast.success(`Đã tải ${uploads.length} ảnh`);
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (img: ListingImage) => {
    setUploading(true);
    try {
      await deleteImageFromCloudinary(img.imageUrl);
      await deleteListingImage(img.id);
      setListingImages((prev) => prev.filter((i) => i.id !== img.id));
      toast.success("Đã xoá ảnh");
    } catch (err) {
      console.error(err);
      toast.error("Xoá ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitForm = async () => {
    setUploading(true);
    try {
      // amenities phải là mảng string id, không phải string hoặc string[]
      let amenityIds: string[] = [];
      if (Array.isArray(amenities)) {
        amenityIds = amenities.filter(
          (id): id is string => typeof id === "string"
        );
      } else if (typeof amenities === "string") {
        amenityIds = [amenities];
      }

      const listingData = {
        name: title,
        type: type,
        amenityIds,
        desc: content,
        roomTypeId,
        imageUrls,
        pricePerNight,
        beds,
        roomsAvailable,
        provinceId: provinceId || null,
        wardId: wardId || null,
      };

      await updateListing(listingId, listingData);

      toast.success("Listing đã được cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật Listing:", err);
      toast.error("Cập nhật Listing thất bại.");
    } finally {
      setUploading(false);
    }
  };

  // Helper to get display name by id
  const getOptionName = (options: { id: string; name: string }[], id: string) =>
    options.find((opt) => opt.id === id)?.name || "";

  if (loading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitForm();
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-black rounded-full hover:bg-gray-200 dark:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-md font-bold flex-1 text-center">
          Chỉnh sửa Listing
        </h1>
        <Button type="submit" className="px-6" disabled={uploading}>
          {uploading ? (
            <LoaderCircle className="animate-spin w-5 h-5" />
          ) : (
            "Lưu"
          )}
        </Button>
      </div>

      {/* ================== THUMBNAIL ================== */}
      <div className="flex flex-col gap-2">
        <Label>Ảnh đại diện</Label>
        <div className="relative w-full aspect-video border rounded-lg overflow-hidden">
          {thumbnail ? (
            <>
              <Image
                src={thumbnail}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white"
                onClick={deleteThumbnail}
                disabled={uploading}
              >
                <X />
              </Button>
            </>
          ) : (
            <label className="flex h-full items-center justify-center cursor-pointer">
              {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files && uploadThumbnail(e.target.files[0])
                }
              />
            </label>
          )}
        </div>
      </div>

      {/* ================== LISTING IMAGES ================== */}
      <div className="flex flex-col gap-2">
        <Label>Ảnh chi tiết</Label>
        <div className="flex gap-3 overflow-x-auto">
          {/* Upload */}
          <label className="w-32 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer shrink-0">
            {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
            <Input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && uploadImages(e.target.files)}
            />
          </label>
          {/* Images */}
          {listingImages.map((img) => (
            <div
              key={img.id}
              className="relative w-32 h-24 rounded overflow-hidden shrink-0"
            >
              <Image src={img.imageUrl} alt="" fill className="object-cover" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1 bg-white"
                onClick={() => removeImage(img)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">Tên Listing</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* Price Per Night */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">Giá mỗi đêm</Label>
        <Input
          type="number"
          value={pricePerNight === 0 ? "" : pricePerNight}
          min={0}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            const val = e.target.value
              .replace(/^0+(?=\d)/, "")
              .replace(/[^0-9]/g, "");
            setPricePerNight(val === "" ? 0 : parseInt(val, 10));
          }}
        />
      </div>
      {/* Beds */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">Số giường</Label>
        <Input
          type="number"
          value={beds}
          min={1}
          onChange={(e) => setBeds(Number(e.target.value))}
        />
      </div>
      {/* Rooms Available */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">
          Số phòng còn lại
        </Label>
        <Input
          type="number"
          value={roomsAvailable}
          min={0}
          onChange={(e) => setRoomsAvailable(Number(e.target.value))}
        />
      </div>
      {/* Province ID */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">
          Tỉnh/Thành phố (provinceId)
        </Label>
        <CustomDropdown
          value={provinceId ? [provinceId] : []}
          placeholder="Chọn tỉnh/thành phố"
          options={provinceOptions}
          onChange={(value) => {
            const id = Array.isArray(value) ? value[0] : value;
            setProvinceId(id || "");
            setWardId(""); // Reset ward when province changes
          }}
          multiple={false}
          displayValue={
            provinceId ? getOptionName(provinceOptions, provinceId) : undefined
          }
        />
      </div>
      {/* Ward ID */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">
          Phường/Xã (wardId)
        </Label>
        <CustomDropdown
          value={wardId ? [wardId] : []}
          placeholder={
            provinceId
              ? wardOptions.length > 0
                ? "Chọn phường/xã"
                : "Không có phường/xã nào"
              : "Chọn tỉnh/thành phố trước"
          }
          options={provinceId ? wardOptions : []}
          onChange={(value) => {
            const id = Array.isArray(value) ? value[0] : value;
            setWardId(id || "");
          }}
          multiple={false}
          displayValue={wardId ? getOptionName(wardOptions, wardId) : undefined}
        />
      </div>
      {/* Dropdowns */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">Tiện ích</Label>
        <CustomDropdown
          value={amenities}
          placeholder="Tiện ích"
          options={amenitiesOptions}
          onChange={(value) => {
            setAmenities(Array.isArray(value) ? value : value ? [value] : []);
          }}
          multiple
        />
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {amenities.map((id) => {
              const name = getOptionName(amenitiesOptions, id);
              return (
                <Badge key={id} variant="secondary">
                  {name}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      {/* Room Type Dropdown */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">Loại phòng</Label>
        <CustomDropdown
          value={roomTypeId ? [roomTypeId] : []}
          placeholder="Chọn loại phòng"
          options={roomTypeOptions}
          onChange={(value) => {
            if (Array.isArray(value)) {
              setRoomTypeId(value[0] || null);
            } else {
              setRoomTypeId(value || null);
            }
          }}
          multiple={false}
          displayValue={
            roomTypeId ? getOptionName(roomTypeOptions, roomTypeId) : undefined
          }
        />
      </div>
      {/* Description */}
      <div className="mb-4">
        <Label className="block mb-2 text-md font-medium">Giới thiệu</Label>
        <Tiptap content={content} onChange={setContent} />
      </div>
    </form>
  );
}
export default EditListingForm;
