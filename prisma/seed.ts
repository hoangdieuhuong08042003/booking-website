import { Amenity, PrismaClient, Prisma, RoomType } from "@prisma/client";

const prisma = new PrismaClient();

// -----------------------------
// 1) Seed provinces/districts/wards
// -----------------------------
async function fetchAndSeedGeo() {
  const count = await prisma.province.count();
  if (count > 0) {
    console.log("🌍 Provinces already seeded, skipping geo seeding.");
    return;
  }

  console.log("🌍 Fetching provinces/districts/wards and caching to DB...");

  // --- Fetch Provinces ---
  const provRes = await fetch("https://vapi.vnappmob.com/api/v2/province/");
  const provJson = await provRes.json();
  const provinces = provJson.results ?? provJson.data ?? [];

  for (const p of provinces) {
    const provinceId = Number(p.province_id);
    if (!provinceId) continue;

    await prisma.province.create({
      data: { id: provinceId, name: p.province_name },
    });

    console.log(`🏙 Seeded province ${p.province_name}`);

    // --- Fetch Districts ---
    const distRes = await fetch(
      `https://vapi.vnappmob.com/api/v2/province/district/${provinceId}`
    );
    const distJson = await distRes.json();
    const districts = distJson.results ?? distJson.data ?? [];

    for (const d of districts) {
      const districtId = Number(d.district_id);
      if (!districtId) continue;

      await prisma.district.create({
        data: {
          id: districtId,
          name: d.district_name,
          provinceId,
        },
      });

      console.log(`  🏘 Seeded district ${d.district_name}`);
    }
  }

  console.log("🎉 Geo caching complete!");
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
        "https://source.unsplash.com/random/800x600?hotel",
        "https://source.unsplash.com/random/800x600?room",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      hasFreeWifi: true,
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
        "https://source.unsplash.com/random/800x600?saigon",
        "https://source.unsplash.com/random/800x600?hotel-luxury",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      hasFreeWifi: true,
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
        "https://source.unsplash.com/random/800x600?resort",
        "https://source.unsplash.com/random/800x600?beach",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      hasFreeWifi: true,
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
        "https://source.unsplash.com/random/800x600?villa",
        "https://source.unsplash.com/random/800x600?dalat",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      hasFreeWifi: true,
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
        "https://source.unsplash.com/random/800x600?sea",
        "https://source.unsplash.com/random/800x600?hotel-sea",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      hasFreeWifi: true,
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
        "https://source.unsplash.com/random/800x600?halong",
        "https://source.unsplash.com/random/800x600?resort-view",
      ],
      thumbnail: "https://source.unsplash.com/random/800x600?halong-resort",
      hasFreeWifi: true,
      avgRating: 4.9,
    },
    {
      id: "hn-cozy-loft",
      name: "Hanoi Cozy Loft",
      type: "Apartment",
      desc: "Căn hộ ấm cúng ở trung tâm Hà Nội, gần các tuyến xe buýt và quán cà phê địa phương.",
      pricePerNight: 700000,
      beds: 1,
      roomsAvailable: 2,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?apartment",
        "https://source.unsplash.com/random/800x600?loft",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.4,
    },
    {
      id: "hcm-riverside-apartment",
      name: "Saigon Riverside Apartment",
      type: "Apartment",
      desc: "Căn hộ hiện đại nhìn ra sông, tiện nghi đầy đủ, gần trung tâm Quận 1.",
      pricePerNight: 1100000,
      beds: 2,
      roomsAvailable: 3,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?apartment-river",
        "https://source.unsplash.com/random/800x600?saigon-apartment",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1505691723518-36a1219e0e19?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.6,
    },
    {
      id: "dn-riverfront-hotel",
      name: "Danang Riverfront Hotel",
      type: "Hotel",
      desc: "Khách sạn nằm bên sông Hàn, tiện đi lại tới cầu Rồng và bãi biển.",
      pricePerNight: 1400000,
      beds: 1,
      roomsAvailable: 7,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?river-hotel",
        "https://source.unsplash.com/random/800x600?danang-hotel",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1501117716987-c8e097e8a6e7?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.5,
    },
    {
      id: "dalat-cabin-retreat",
      name: "Dalat Cabin Retreat",
      type: "Cabin",
      desc: "Cabin gỗ nhỏ xinh giữa rừng thông, yên tĩnh, thích hợp nghỉ dưỡng cuối tuần.",
      pricePerNight: 900000,
      beds: 2,
      roomsAvailable: 2,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?cabin",
        "https://source.unsplash.com/random/800x600?forest-cabin",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: false,
      avgRating: 4.7,
    },
    {
      id: "nhatrang-boutique",
      name: "Nha Trang Boutique Stay",
      type: "Boutique Hotel",
      desc: "Khách sạn thiết kế boutique, gần bãi biển, nhiều nhà hàng địa phương xung quanh.",
      pricePerNight: 800000,
      beds: 1,
      roomsAvailable: 4,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?boutique-hotel",
        "https://source.unsplash.com/random/800x600?nha-trang",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.2,
    },
    {
      id: "halong-luxury-suite",
      name: "Halong Luxury Suite",
      type: "Suite",
      desc: "Suite cao cấp với view vịnh và ban công rộng, dịch vụ spa tại chỗ.",
      pricePerNight: 3500000,
      beds: 2,
      roomsAvailable: 1,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?luxury-hotel",
        "https://source.unsplash.com/random/800x600?halong-bay",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1505691723518-36a1219e0e19?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.9,
    },
    {
      id: "hn-boutique-hostel",
      name: "Hanoi Boutique Hostel",
      type: "Hostel",
      desc: "Hostel trẻ trung, phù hợp nhóm du lịch tiết kiệm, nằm gần các quán ăn đêm.",
      pricePerNight: 250000,
      beds: 4,
      roomsAvailable: 12,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?hostel",
        "https://source.unsplash.com/random/800x600?hanoi-hostel",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.1,
    },
    {
      id: "hcm-sky-condo",
      name: "Saigon Sky Condo",
      type: "Condo",
      desc: "Căn hộ cao cấp trên tầng cao, tầm nhìn thành phố, đầy đủ tiện nghi cho gia đình.",
      pricePerNight: 2000000,
      beds: 3,
      roomsAvailable: 6,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?condo",
        "https://source.unsplash.com/random/800x600?city-view",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1505691723518-36a1219e0e19?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.6,
    },
    {
      id: "dn-family-villa",
      name: "Danang Family Villa",
      type: "Villa",
      desc: "Villa rộng rãi cho gia đình, sân vườn và bếp đầy đủ, gần biển.",
      pricePerNight: 3200000,
      beds: 4,
      roomsAvailable: 5,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?family-villa",
        "https://source.unsplash.com/random/800x600?villa-beach",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: true,
      avgRating: 4.8,
    },
    {
      id: "dalat-ecolodge",
      name: "Dalat Ecolodge",
      type: "Ecolodge",
      desc: "Ecolodge thân thiện môi trường, sử dụng năng lượng tái tạo và thực phẩm địa phương.",
      pricePerNight: 950000,
      beds: 2,
      roomsAvailable: 3,
      imageUrls: [
        "https://source.unsplash.com/random/800x600?ecolodge",
        "https://source.unsplash.com/random/800x600?dalat-nature",
      ],
      thumbnail:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
      hasFreeWifi: false,
      avgRating: 4.5,
    },
  ];

  for (const listing of listingsData) {
    // Chọn province ngẫu nhiên
    const provinces = await prisma.province.findMany();
    if (provinces.length === 0) {
      console.warn(`No provinces in DB to assign for listing ${listing.name}, skipping.`);
      continue;
    }
    const randProv = provinces[Math.floor(Math.random() * provinces.length)];
    const provinceId = randProv.id;

    // Chọn district thuộc province đó
    const districtsInProv = await prisma.district.findMany({ where: { provinceId } });
    if (districtsInProv.length === 0) {
      console.warn(`No districts found in province ${provinceId} for listing ${listing.name}, skipping.`);
      continue;
    }
    const chosenDistrict = districtsInProv[Math.floor(Math.random() * districtsInProv.length)];
    const districtId = chosenDistrict.id;

    // Gán roomTypeId dựa trên type
    const roomType = roomTypeRecords.find(
      (rt) => rt.name.toLowerCase() === listing.type.toLowerCase()
    );
    const roomTypeId = roomType ? roomType.id : undefined;

    console.log(`Assigning listing ${listing.name}: provinceId=${provinceId}, districtId=${districtId}`);

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
        hasFreeWifi: listing.hasFreeWifi ?? false,
        provinceId,
        districtId,
        avgRating: listing.avgRating ?? 0,
        roomTypeId,
      },
      create: { ...listing, imageUrls: listing.imageUrls ?? [], provinceId, districtId, roomTypeId },
    });
  }

  // Gán amenities ngẫu nhiên cho listings
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
  }
}

// -----------------------------
// MAIN
// -----------------------------
async function main() {
  console.log("🌱 Seeding database...");

  await fetchAndSeedGeo();
  const amenities = await seedAmenities();
  const roomTypes = await seedRoomTypes();
  await seedListings(amenities, roomTypes);

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
