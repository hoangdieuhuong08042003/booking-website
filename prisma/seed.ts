import { Amenity, PrismaClient, Prisma, RoomType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function seedGeo() {
  console.log("🌍 Checking existing provinces...");

  const count = await prisma.province.count();
  if (count > 0) {
    console.log("✔ Provinces already exist. Skip seeding.");
    return;
  }

  console.log("🌍 Loading geo data from JSON...");

  const jsonPath = path.join(process.cwd(), "public", "vietnam.json");

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`❌ JSON file not found at ${jsonPath}`);
  }

  const file = fs.readFileSync(jsonPath, "utf8");
  const provinces = JSON.parse(file);

  if (!Array.isArray(provinces)) {
    throw new Error("❌ JSON format invalid: must be an array");
  }

  console.log(`📌 Found ${provinces.length} provinces in file.`);

  for (const p of provinces) {
    const provinceName = p.FullName;
    const provinceCode = p.Code;

    if (!provinceName) continue;

    // 👉 Insert Province
    const province = await prisma.province.create({
      data: {
        name: provinceName,
        id: provinceCode ,
      },
    });

    console.log(`🏙 Inserted province: ${province.name}`);

    const wards = p.Wards || [];

    if (wards.length === 0) continue;

    // 👉 Prepare ward list for batch insert
    const wardData = wards.map((w) => ({
      name: w.FullName,
      provinceId: province.id,
      id: w.Code,
    }));

    // 👉 Bulk insert instead of looping → faster (Prisma createMany)
    await prisma.ward.createMany({
      data: wardData,
      skipDuplicates: true,
    });

    console.log(`   ➕ Inserted ${wardData.length} wards`);
  }

  console.log("🎉 DONE — Geo data seeded successfully!");
}



// -----------------------------
// 2) Seed amenities
// -----------------------------
async function seedAmenities(): Promise<Amenity[]> {
  const amenities = [
    "Wifi miễn phí",
    "Máy lạnh",
    "TV",
    "Bãi đỗ xe",
    "Hồ bơi",
    "View biển",
    "Nhà hàng",
    "Lễ tân 24h",
    "Ăn sáng miễn phí",
  ];

  const records: Amenity[] = [];

  for (const name of amenities) {
    const a = await prisma.amenity.upsert({
      where: { name } as Prisma.AmenityWhereUniqueInput,
      update: {},
      create: { name },
    });
    records.push(a);
  }

  return records;
}

// -----------------------------
// 2.1) Seed room types
// -----------------------------
async function seedRoomTypes(): Promise<RoomType[]> {
  const roomTypes = [
    { name: "Hotel", desc: "Khách sạn tiêu chuẩn" },
    { name: "Homestay", desc: "Nhà ở địa phương" },
    { name: "Apartment", desc: "Căn hộ" },
    { name: "Villa", desc: "Biệt thự" },
    { name: "Resort", desc: "Khu nghỉ dưỡng" },
    { name: "Cabin", desc: "Nhà gỗ nhỏ" },
    { name: "Boutique Hotel", desc: "Khách sạn boutique" },
    { name: "Suite", desc: "Phòng suite cao cấp" },
    { name: "Hostel", desc: "Nhà nghỉ tập thể" },
    { name: "Condo", desc: "Chung cư" },
    { name: "Ecolodge", desc: "Nhà nghỉ sinh thái" },
  ];
  const records: RoomType[] = [];
  for (const rt of roomTypes) {
    const rec = await prisma.roomType.upsert({
      where: { name: rt.name },
      update: {},
      create: rt,
    });
    records.push(rec);
  }
  return records;
}

// -----------------------------
// 3) Seed listings
// -----------------------------
async function seedListings(
  amenityRecords: Amenity[],
  roomTypeRecords: RoomType[]
) {
  console.log("🏠 Starting to seed listings...");

  // Fetch provinces and wards ONCE before the loop
  const provinces = await prisma.province.findMany({
    include: {
      wards: true,
    },
  });

  if (provinces.length === 0) {
    console.warn("⚠️ No provinces found in database. Skipping listings.");
    return;
  }

  console.log(`📍 Found ${provinces.length} provinces to assign.`);

  // 4) LISTINGS (VIỆT NAM)
  // --------------------------------------
  const listingsData = [
    {
      id: "hn-lakeview",
      name: "Hanoi Lakeview Homestay",
      type: "Homestay",
      desc: "Homestay trung tâm Hà Nội, gần hồ Hoàn Kiếm.",
      pricePerNight: 850000,
      beds: 2,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      avgRating: 4.5,
    },
    {
      id: "hcm-center-hotel",
      name: "Saigon Central Hotel",
      type: "Hotel",
      desc: "Khách sạn Quận 1, gần phố đi bộ Nguyễn Huệ.",
      pricePerNight: 1200000,
      beds: 1,
      roomsAvailable: 10,
      imageUrls: [
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
      avgRating: 4.2,
    },
    {
      id: "dn-beach-resort",
      name: "Danang Beach Resort",
      type: "Resort",
      desc: "Resort sát biển Mỹ Khê.",
      pricePerNight: 2500000,
      beds: 2,
      roomsAvailable: 8,
      imageUrls: [
        "https://images.pexels.com/photos/267957/pexels-photo-267957.jpeg",
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      avgRating: 4.8,
    },
    {
      id: "dalat-villa",
      name: "Dalat Mountain Villa",
      type: "Villa",
      desc: "Villa view đồi thông, khí hậu mát mẻ.",
      pricePerNight: 1800000,
      beds: 3,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
        "https://images.pexels.com/photos/271815/pexels-photo-271815.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/271815/pexels-photo-271815.jpeg",
      avgRating: 4.7,
    },
    {
      id: "nhatrang-sea-hotel",
      name: "Nha Trang Sea Hotel",
      type: "Hotel",
      desc: "Khách sạn gần biển Trần Phú, view đẹp.",
      pricePerNight: 950000,
      beds: 2,
      roomsAvailable: 6,
      imageUrls: [
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
        "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      avgRating: 4.3,
    },
    {
      id: "halong-view-resort",
      name: "Halong View Resort",
      type: "Resort",
      desc: "Resort view vịnh Hạ Long, cao cấp.",
      pricePerNight: 2800000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg",
        "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg",
      avgRating: 4.9,
    },
    {
      id: "hn-cozy-loft",
      name: "Hanoi Cozy Loft",
      type: "Apartment",
      desc: "Căn hộ ấm cúng ở trung tâm Hà Nội.",
      pricePerNight: 700000,
      beds: 1,
      roomsAvailable: 2,
      imageUrls: [
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
        "https://images.pexels.com/photos/265807/pexels-photo-265807.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      avgRating: 4.4,
    },
    {
      id: "hcm-riverside-apartment",
      name: "Saigon Riverside Apartment",
      type: "Apartment",
      desc: "Căn hộ nhìn ra sông, tiện nghi đầy đủ.",
      pricePerNight: 1100000,
      beds: 2,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg",
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
      avgRating: 4.6,
    },
    {
      id: "dn-riverfront-hotel",
      name: "Danang Riverfront Hotel",
      type: "Hotel",
      desc: "Bên sông Hàn, gần cầu Rồng.",
      pricePerNight: 1400000,
      beds: 1,
      roomsAvailable: 7,
      imageUrls: [
        "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
        "https://images.pexels.com/photos/26139/pexels-photo.jpg",
      ],
      thumbnail: "https://images.pexels.com/photos/26139/pexels-photo.jpg",
      avgRating: 4.5,
    },
    {
      id: "dalat-cabin-retreat",
      name: "Dalat Cabin Retreat",
      type: "Cabin",
      desc: "Cabin gỗ nhỏ xinh giữa rừng thông.",
      pricePerNight: 900000,
      beds: 2,
      roomsAvailable: 2,
      imageUrls: [
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
        "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
      avgRating: 4.7,
    },
    {
      id: "nhatrang-boutique",
      name: "Nha Trang Boutique Stay",
      type: "Boutique Hotel",
      desc: "Thiết kế boutique, gần biển.",
      pricePerNight: 800000,
      beds: 1,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/246728/pexels-photo-246728.jpeg",
        "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/246728/pexels-photo-246728.jpeg",
      avgRating: 4.2,
    },
    {
      id: "halong-luxury-suite",
      name: "Halong Luxury Suite",
      type: "Suite",
      desc: "Suite cao cấp view vịnh.",
      pricePerNight: 3500000,
      beds: 2,
      roomsAvailable: 1,
      imageUrls: [
        "https://images.pexels.com/photos/267957/pexels-photo-267957.jpeg",
        "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/267957/pexels-photo-267957.jpeg",
      avgRating: 4.9,
    },
    {
      id: "hn-boutique-hostel",
      name: "Hanoi Boutique Hostel",
      type: "Hostel",
      desc: "Hostel cho nhóm du lịch tiết kiệm.",
      pricePerNight: 250000,
      beds: 4,
      roomsAvailable: 12,
      imageUrls: [
        "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
      avgRating: 4.1,
    },
    {
      id: "hcm-sky-condo",
      name: "Saigon Sky Condo",
      type: "Condo",
      desc: "Căn hộ cao cấp, tầm nhìn thành phố.",
      pricePerNight: 2000000,
      beds: 3,
      roomsAvailable: 6,
      imageUrls: [
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
        "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
      avgRating: 4.6,
    },
    {
      id: "dn-family-villa",
      name: "Danang Family Villa",
      type: "Villa",
      desc: "Villa rộng rãi cho gia đình.",
      pricePerNight: 3200000,
      beds: 4,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
        "https://images.pexels.com/photos/271815/pexels-photo-271815.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
      avgRating: 4.8,
    },
    {
      id: "dalat-ecolodge",
      name: "Dalat Ecolodge",
      type: "Ecolodge",
      desc: "Thân thiện môi trường, gần thiên nhiên.",
      pricePerNight: 950000,
      beds: 2,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
      avgRating: 4.5,
    },

    // ⭐️⭐️⭐️ NEW LISTINGS ⭐️⭐️⭐️
    {
      id: "phuquoc-bungalow",
      name: "Phu Quoc Beach Bungalow",
      type: "Bungalow",
      desc: "Bungalow sát biển, cực kỳ yên tĩnh.",
      pricePerNight: 1600000,
      beds: 2,
      roomsAvailable: 6,
      imageUrls: [
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
        "https://images.pexels.com/photos/267957/pexels-photo-267957.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      avgRating: 4.6,
    },
    {
      id: "phuquoc-sea-resort",
      name: "Phu Quoc Sea Resort",
      type: "Resort",
      desc: "Resort cao cấp ven biển, hồ bơi vô cực.",
      pricePerNight: 3000000,
      beds: 2,
      roomsAvailable: 7,
      imageUrls: [
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
        "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      avgRating: 4.9,
    },
    {
      id: "sapa-mountain-lodge",
      name: "Sapa Mountain Lodge",
      type: "Lodge",
      desc: "Nhà nghỉ trên núi Sapa, view ruộng bậc thang.",
      pricePerNight: 1300000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
        "https://images.pexels.com/photos/265807/pexels-photo-265807.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
      avgRating: 4.7,
    },
    {
      id: "hue-riverside-hotel",
      name: "Hue Riverside Hotel",
      type: "Hotel",
      desc: "Khách sạn bên sông Hương.",
      pricePerNight: 1000000,
      beds: 2,
      roomsAvailable: 9,
      imageUrls: [
        "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
        "https://images.pexels.com/photos/26139/pexels-photo.jpg",
      ],
      thumbnail: "https://images.pexels.com/photos/26139/pexels-photo.jpg",
      avgRating: 4.4,
    },
    {
      id: "hcm-lux-serviced",
      name: "Saigon Luxury Serviced Apartment",
      type: "Condo",
      desc: "Condo hiện đại, dịch vụ như khách sạn.",
      pricePerNight: 2400000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg",
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg",
      avgRating: 4.8,
    },
    {
      id: "dn-airport-hotel",
      name: "Danang Airport Hotel",
      type: "Hotel",
      desc: "Khách sạn gần sân bay, tiện di chuyển.",
      pricePerNight: 600000,
      beds: 1,
      roomsAvailable: 12,
      imageUrls: [
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        "https://images.pexels.com/photos/246728/pexels-photo-246728.jpeg",
      ],
      thumbnail: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
      avgRating: 4.0,
    },
    {
      id: "phuquoc-forest-villa",
      name: "Phu Quoc Forest Villa",
      type: "Villa",
      desc: "Villa giữa rừng, yên tĩnh và riêng tư.",
      pricePerNight: 2200000,
      beds: 3,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
        "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210258/pexels-photo-210258.jpeg",
      avgRating: 4.7,
    },
    {
      id: "sapa-wooden-homestay",
      name: "Sapa Wooden Homestay",
      type: "Homestay",
      desc: "Homestay gỗ truyền thống, view núi đẹp.",
      pricePerNight: 750000,
      beds: 2,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/259969/pexels-photo-259969.jpeg",
        "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
        "https://images.pexels.com/photos/210415/pexels-photo-210415.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg",
      avgRating: 4.5,
    },
    {
      id: "nhatrang-sunset-condo",
      name: "Nha Trang Sunset Condo",
      type: "Condo",
      desc: "Căn hộ cao tầng view hoàng hôn biển.",
      pricePerNight: 1800000,
      beds: 2,
      roomsAvailable: 6,
      imageUrls: [
        "https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg",
        "https://images.pexels.com/photos/276551/pexels-photo-276551.jpeg",
        "https://images.pexels.com/photos/276549/pexels-photo-276549.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg",
      avgRating: 4.6,
    },
    {
      id: "dalat-snow-lodge",
      name: "Dalat Snow Lodge",
      type: "Lodge",
      desc: "Lodge phong cách Bắc Âu giữa rừng thông.",
      pricePerNight: 1600000,
      beds: 2,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/276721/pexels-photo-276721.jpeg",
        "https://images.pexels.com/photos/276729/pexels-photo-276729.jpeg",
        "https://images.pexels.com/photos/276730/pexels-photo-276730.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210180/pexels-photo-210180.jpeg",
      avgRating: 4.8,
    },
    {
      id: "hue-ancient-homestay",
      name: "Hue Ancient Homestay",
      type: "Homestay",
      desc: "Nhà cổ Huế, sân vườn thoáng mát.",
      pricePerNight: 650000,
      beds: 1,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/276550/pexels-photo-276550.jpeg",
        "https://images.pexels.com/photos/276557/pexels-photo-276557.jpeg",
        "https://images.pexels.com/photos/276552/pexels-photo-276552.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210312/pexels-photo-210312.jpeg",
      avgRating: 4.3,
    },
    {
      id: "hcm-central-loft",
      name: "Saigon Central Loft",
      type: "Apartment",
      desc: "Loft hiện đại ngay trung tâm Quận 1.",
      pricePerNight: 1500000,
      beds: 1,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/276508/pexels-photo-276508.jpeg",
        "https://images.pexels.com/photos/276533/pexels-photo-276533.jpeg",
        "https://images.pexels.com/photos/276536/pexels-photo-276536.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/2103125/pexels-photo-2103125.jpeg",
      avgRating: 4.5,
    },
    {
      id: "danang-harbor-suite",
      name: "Danang Harbor Suite",
      type: "Suite",
      desc: "Suite cao cấp nhìn ra bến cảng.",
      pricePerNight: 2800000,
      beds: 2,
      roomsAvailable: 2,
      imageUrls: [
        "https://images.pexels.com/photos/276543/pexels-photo-276543.jpeg",
        "https://images.pexels.com/photos/276546/pexels-photo-276546.jpeg",
        "https://images.pexels.com/photos/276538/pexels-photo-276538.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210300/pexels-photo-210300.jpeg",
      avgRating: 4.9,
    },
    {
      id: "phuquoc-ocean-cabin",
      name: "Phu Quoc Ocean Cabin",
      type: "Cabin",
      desc: "Cabin gỗ sát biển, cực chill.",
      pricePerNight: 950000,
      beds: 1,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/276541/pexels-photo-276541.jpeg",
        "https://images.pexels.com/photos/276542/pexels-photo-276542.jpeg",
        "https://images.pexels.com/photos/276545/pexels-photo-276545.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210293/pexels-photo-210293.jpeg",
      avgRating: 4.4,
    },
    {
      id: "sapa-lake-resort",
      name: "Sapa Lake Resort",
      type: "Resort",
      desc: "Resort sát hồ, khí hậu mát quanh năm.",
      pricePerNight: 2600000,
      beds: 2,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/276709/pexels-photo-276709.jpeg",
        "https://images.pexels.com/photos/276704/pexels-photo-276704.jpeg",
        "https://images.pexels.com/photos/276701/pexels-photo-276701.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210380/pexels-photo-210380.jpeg",
      avgRating: 4.8,
    },
    {
      id: "dalat-green-retreat",
      name: "Dalat Green Retreat",
      type: "Ecolodge",
      desc: "Khu nghỉ dưỡng xanh hòa mình vào thiên nhiên.",
      pricePerNight: 1000000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/276688/pexels-photo-276688.jpeg",
        "https://images.pexels.com/photos/276682/pexels-photo-276682.jpeg",
        "https://images.pexels.com/photos/276686/pexels-photo-276686.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/210279/pexels-photo-210279.jpeg",
      avgRating: 4.5,
    },
    {
      id: "hanoi-lakeview-apartment",
      name: "Hanoi Lakeview Apartment",
      type: "Apartment",
      desc: "Căn hộ cao cấp nhìn ra Hồ Tây, tiện nghi hiện đại.",
      pricePerNight: 1900000,
      beds: 2,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg",
        "https://images.pexels.com/photos/276479/pexels-photo-276479.jpeg",
        "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/276461/pexels-photo-276461.jpeg",
      avgRating: 4.6,
    },
    {
      id: "haiphong-boutique-hotel",
      name: "Haiphong Boutique Hotel",
      type: "Hotel",
      desc: "Khách sạn boutique phong cách châu Âu ngay trung tâm.",
      pricePerNight: 1200000,
      beds: 1,
      roomsAvailable: 6,
      imageUrls: [
        "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg",
        "https://images.pexels.com/photos/237390/pexels-photo-237390.jpeg",
        "https://images.pexels.com/photos/237388/pexels-photo-237388.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/237401/pexels-photo-237401.jpeg",
      avgRating: 4.4,
    },
    {
      id: "quangninh-bay-villa",
      name: "Quang Ninh Bay Villa",
      type: "Villa",
      desc: "Villa sát vịnh Hạ Long với hồ bơi riêng.",
      pricePerNight: 3100000,
      beds: 3,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
        "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg",
        "https://images.pexels.com/photos/261187/pexels-photo-261188.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/261142/pexels-photo-261142.jpeg",
      avgRating: 4.9,
    },
    {
      id: "hagiang-mountain-homestay",
      name: "Ha Giang Mountain Homestay",
      type: "Homestay",
      desc: "Homestay bản địa với view núi đá hùng vĩ.",
      pricePerNight: 550000,
      beds: 2,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg",
        "https://images.pexels.com/photos/1261729/pexels-photo-1261729.jpeg",
        "https://images.pexels.com/photos/1261732/pexels-photo-1261732.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/1261730/pexels-photo-1261730.jpeg",
      avgRating: 4.7,
    },
    {
      id: "quangbinh-riverside-lodge",
      name: "Quang Binh Riverside Lodge",
      type: "Lodge",
      desc: "Lodge cạnh sông Son, không gian thanh bình.",
      pricePerNight: 1300000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/276792/pexels-photo-276792.jpeg",
        "https://images.pexels.com/photos/276793/pexels-photo-276793.jpeg",
        "https://images.pexels.com/photos/276794/pexels-photo-276794.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/276795/pexels-photo-276795.jpeg",
      avgRating: 4.5,
    },
    {
      id: "quangnam-garden-ecolodge",
      name: "Quang Nam Garden Ecolodge",
      type: "Ecolodge",
      desc: "Ecolodge hòa mình thiên nhiên, gần phố cổ Hội An.",
      pricePerNight: 1100000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/276803/pexels-photo-276803.jpeg",
        "https://images.pexels.com/photos/276804/pexels-photo-276804.jpeg",
        "https://images.pexels.com/photos/276805/pexels-photo-276805.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/276806/pexels-photo-276806.jpeg",
      avgRating: 4.6,
    },
    {
      id: "pleiku-hill-cabin",
      name: "Pleiku Hill Cabin",
      type: "Cabin",
      desc: "Cabin giữa đồi chè mát lạnh.",
      pricePerNight: 900000,
      beds: 1,
      roomsAvailable: 3,
      imageUrls: [
        "https://images.pexels.com/photos/276844/pexels-photo-276844.jpeg",
        "https://images.pexels.com/photos/276845/pexels-photo-276845.jpeg",
        "https://images.pexels.com/photos/276846/pexels-photo-276846.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/276847/pexels-photo-276847.jpeg",
      avgRating: 4.4,
    },
    {
      id: "nhatrang-beach-resort",
      name: "Nha Trang Beach Resort",
      type: "Resort",
      desc: "Resort sát biển với bãi tắm riêng.",
      pricePerNight: 2700000,
      beds: 2,
      roomsAvailable: 6,
      imageUrls: [
        "https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg",
        "https://images.pexels.com/photos/1458453/pexels-photo-1458453.jpeg",
        "https://images.pexels.com/photos/1458455/pexels-photo-1458455.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/1458451/pexels-photo-1458451.jpeg",
      avgRating: 4.8,
    },
    {
      id: "cantho-river-apartment",
      name: "Can Tho River Apartment",
      type: "Apartment",
      desc: "Căn hộ nhìn ra sông Hậu, gần bến Ninh Kiều.",
      pricePerNight: 1400000,
      beds: 1,
      roomsAvailable: 5,
      imageUrls: [
        "https://images.pexels.com/photos/276885/pexels-photo-276885.jpeg",
        "https://images.pexels.com/photos/276887/pexels-photo-276887.jpeg",
        "https://images.pexels.com/photos/276889/pexels-photo-276889.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/276886/pexels-photo-276886.jpeg",
      avgRating: 4.5,
    },
    {
      id: "camau-mangrove-homestay",
      name: "Ca Mau Mangrove Homestay",
      type: "Homestay",
      desc: "Homestay trên rừng ngập mặn, trải nghiệm thiên nhiên hoang sơ.",
      pricePerNight: 700000,
      beds: 2,
      roomsAvailable: 4,
      imageUrls: [
        "https://images.pexels.com/photos/276900/pexels-photo-276900.jpeg",
        "https://images.pexels.com/photos/276901/pexels-photo-276901.jpeg",
        "https://images.pexels.com/photos/276902/pexels-photo-276902.jpeg",
      ],
      thumbnail:
        "https://images.pexels.com/photos/276903/pexels-photo-276903.jpeg",
      avgRating: 4.3,
    },
  ];

  let count = 0;
  for (const listing of listingsData) {
    try {
      // Choose random province
      const randProv = provinces[Math.floor(Math.random() * provinces.length)];
      const provinceId = randProv.id;

      // Choose random ward from that province
      if (randProv.wards.length === 0) {
        console.warn(
          `⚠️ No wards found for province ${randProv.name}, skipping listing ${listing.name}`
        );
        continue;
      }
      const chosenWard = randProv.wards[Math.floor(Math.random() * randProv.wards.length)];
      const wardId = chosenWard.id;

      // Find roomType
      const roomType = roomTypeRecords.find(
        (rt) => rt.name.toLowerCase() === listing.type.toLowerCase()
      );
      const roomTypeId = roomType ? roomType.id : undefined;

      if (!roomTypeId) {
        console.warn(
          `⚠️ No room type found for "${listing.type}", skipping listing ${listing.name}`
        );
        continue;
      }

      // Upsert listing
      await prisma.listing.upsert({
        where: { id: listing.id },
        update: {
          name: listing.name,
          type: listing.type,
          desc: listing.desc,
          pricePerNight: listing.pricePerNight,
          beds: listing.beds,
          roomsAvailable: listing.roomsAvailable ?? 0,
          imageUrls: listing.imageUrls ?? [],
          thumbnail: listing.thumbnail ?? null,
          provinceId,
          wardId,
          avgRating: listing.avgRating ?? 0,
          roomTypeId,
        },
        create: {
          id: listing.id,
          name: listing.name,
          type: listing.type,
          desc: listing.desc,
          pricePerNight: listing.pricePerNight,
          beds: listing.beds,
          roomsAvailable: listing.roomsAvailable ?? 0,
          imageUrls: listing.imageUrls ?? [],
          thumbnail: listing.thumbnail ?? null,
          provinceId,
          wardId,
          avgRating: listing.avgRating ?? 0,
          roomTypeId,
        },
      });

      count++;
      if (count % 10 === 0) {
        console.log(`   ✓ Processed ${count}/${listingsData.length} listings...`);
      }

      // Small delay to prevent overwhelming the connection
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`❌ Error seeding listing ${listing.name}:`, error);
      continue;
    }
  }

  console.log(`✅ Seeded ${count} listings successfully!`);

  // Gán amenities ngẫu nhiên cho listings
  console.log("🎨 Assigning amenities to listings...");
  const allListings = await prisma.listing.findMany();
  const relationsData: { listingId: string; amenityId: string }[] = [];

  for (const listing of allListings) {
    const randomAmenities = amenityRecords.sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const a of randomAmenities) {
      relationsData.push({ listingId: listing.id, amenityId: a.id });
    }
  }

  if (relationsData.length > 0) {
    await prisma.listingAmenity.createMany({ data: relationsData, skipDuplicates: true });
    console.log(`✅ Assigned amenities to ${allListings.length} listings!`);
  }
}

// -----------------------------
// 4) Seed reviews
// -----------------------------
async function seedReviews() {
  console.log("📝 Seeding sample reviews...");

  // Lấy danh sách user và listing
  const users = await prisma.user.findMany({ take: 10 });
  const listings = await prisma.listing.findMany();

  if (users.length === 0 || listings.length === 0) {
    console.warn("⚠️ No users or listings found. Skipping reviews.");
    return;
  }

  // Một số nội dung review mẫu
  const reviewTexts = [
    "Chỗ ở rất sạch sẽ và tiện nghi.",
    "Chủ nhà thân thiện, vị trí thuận tiện.",
    "Phòng đẹp, view tuyệt vời.",
    "Dịch vụ tốt, sẽ quay lại lần sau.",
    "Giá hợp lý, trải nghiệm tuyệt vời.",
    "Không gian yên tĩnh, thích hợp nghỉ dưỡng.",
    "Bữa sáng ngon, nhân viên nhiệt tình.",
    "Phòng hơi nhỏ nhưng đủ tiện nghi.",
    "Gần trung tâm, dễ di chuyển.",
    "Rất hài lòng với kỳ nghỉ tại đây.",
  ];

  let count = 0;
  for (const listing of listings) {
    // Mỗi listing có 2–4 review ngẫu nhiên
    const numReviews = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numReviews; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const text = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const stars = Math.floor(Math.random() * 3) + 3; // 3–5 sao

      await prisma.review.create({
        data: {
          text,
          stars,
          listingId: listing.id,
          userId: user.id,
        },
      });
      count++;
    }
  }
  console.log(`✅ Seeded ${count} sample reviews!`);
}

// -----------------------------
// MAIN
// -----------------------------
async function main() {
  console.log("🌱 Seeding database...");

  try {
    await seedGeo();
    const amenities = await seedAmenities();
    const roomTypes = await seedRoomTypes();
    await seedListings(amenities, roomTypes);
    await seedReviews(); // <-- Thêm dòng này để seed review

    console.log("✅ Seed completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
