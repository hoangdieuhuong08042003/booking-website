import { Amenity, PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --------------------------------------
  // 1) TỈNH THÀNH
  // --------------------------------------
  const provinces = [
    { id: 1, name: "Hà Nội" },
    { id: 2, name: "TP. Hồ Chí Minh" },
    { id: 3, name: "Đà Nẵng" },
    { id: 4, name: "Lâm Đồng" },     // Đà Lạt
    { id: 5, name: "Khánh Hòa" },    // Nha Trang
    { id: 6, name: "Quảng Ninh" },   // Hạ Long
  ];

  for (const p of provinces) {
    await prisma.province.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

  // --------------------------------------
  // 2) QUẬN / HUYỆN
  // --------------------------------------
  const districts = [
    // Hà Nội
    { id: 1, name: "Hoàn Kiếm", provinceId: 1 },
    { id: 2, name: "Ba Đình", provinceId: 1 },

    // HCM
    { id: 3, name: "Quận 1", provinceId: 2 },
    { id: 4, name: "Quận Bình Thạnh", provinceId: 2 },

    // Đà Nẵng
    { id: 5, name: "Hải Châu", provinceId: 3 },
    { id: 6, name: "Sơn Trà", provinceId: 3 },

    // Đà Lạt
    { id: 7, name: "TP Đà Lạt", provinceId: 4 },

    // Nha Trang
    { id: 8, name: "TP Nha Trang", provinceId: 5 },

    // Hạ Long
    { id: 9, name: "TP Hạ Long", provinceId: 6 },
  ];

  for (const d of districts) {
    await prisma.district.upsert({
      where: { id: d.id },
      update: {},
      create: d,
    });
  }

  // --------------------------------------
  // 3) AMENITIES (TIỆN NGHI)
  // --------------------------------------
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

  const amenityRecords: Amenity[] = [];

  for (const name of amenities) {
    // upsert by name (requires `name` to be unique in the schema)
    const a = await prisma.amenity.upsert({
      where: { name } as Prisma.AmenityWhereUniqueInput,
      update: {},
      create: { name },
    });
    amenityRecords.push(a);
  }

  // --------------------------------------
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
    imageUrls: [
      "https://source.unsplash.com/random/800x600?hotel",
      "https://source.unsplash.com/random/800x600?room",
    ],
    thumbnail: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hasFreeWifi: true,
    provinceId: 1,
    districtId: 1,
    avgRating: 4.5,
  },

  {
    id: "hcm-center-hotel",
    name: "Saigon Central Hotel",
    type: "Hotel",
    desc: "Khách sạn Quận 1, gần phố đi bộ Nguyễn Huệ.",
    pricePerNight: 1200000,
    beds: 1,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?saigon",
      "https://source.unsplash.com/random/800x600?hotel-luxury",
    ],
    thumbnail: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hasFreeWifi: true,
    provinceId: 2,
    districtId: 3,
    avgRating: 4.2,
  },

  {
    id: "dn-beach-resort",
    name: "Danang Beach Resort",
    type: "Resort",
    desc: "Resort sát biển Mỹ Khê.",
    pricePerNight: 2500000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?resort",
      "https://source.unsplash.com/random/800x600?beach",
    ],
    thumbnail: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hasFreeWifi: true,
    provinceId: 3,
    districtId: 6,
    avgRating: 4.8,
  },

  {
    id: "dalat-villa",
    name: "Dalat Mountain Villa",
    type: "Villa",
    desc: "Villa view đồi thông, khí hậu mát mẻ.",
    pricePerNight: 1800000,
    beds: 3,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?villa",
      "https://source.unsplash.com/random/800x600?dalat",
    ],
    thumbnail: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hasFreeWifi: true,
    provinceId: 4,
    districtId: 7,
    avgRating: 4.7,
  },

  {
    id: "nhatrang-sea-hotel",
    name: "Nha Trang Sea Hotel",
    type: "Hotel",
    desc: "Khách sạn gần biển Trần Phú, view đẹp.",
    pricePerNight: 950000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?sea",
      "https://source.unsplash.com/random/800x600?hotel-sea",
    ],
    thumbnail: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hasFreeWifi: true,
    provinceId: 5,
    districtId: 8,
    avgRating: 4.3,
  },

  {
    id: "halong-view-resort",
    name: "Halong View Resort",
    type: "Resort",
    desc: "Resort view vịnh Hạ Long, cao cấp.",
    pricePerNight: 2800000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?halong",
      "https://source.unsplash.com/random/800x600?resort-view",
    ],
    // fixed malformed URL
    thumbnail: "https://source.unsplash.com/random/800x600?halong-resort",
    hasFreeWifi: true,
    provinceId: 6,
    districtId: 9,
    avgRating: 4.9,
  },
  {
    id: "hn-cozy-loft",
    name: "Hanoi Cozy Loft",
    type: "Apartment",
    desc: "Căn hộ ấm cúng ở trung tâm Hà Nội, gần các tuyến xe buýt và quán cà phê địa phương.",
    pricePerNight: 700000,
    beds: 1,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?apartment",
      "https://source.unsplash.com/random/800x600?loft"
    ],
    thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 1,
    districtId: 2,
    avgRating: 4.4,
  },
  {
    id: "hcm-riverside-apartment",
    name: "Saigon Riverside Apartment",
    type: "Apartment",
    desc: "Căn hộ hiện đại nhìn ra sông, tiện nghi đầy đủ, gần trung tâm Quận 1.",
    pricePerNight: 1100000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?apartment-river",
      "https://source.unsplash.com/random/800x600?saigon-apartment"
    ],
    thumbnail: "https://images.unsplash.com/photo-1505691723518-36a1219e0e19?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 2,
    districtId: 3,
    avgRating: 4.6,
  },
  {
    id: "dn-riverfront-hotel",
    name: "Danang Riverfront Hotel",
    type: "Hotel",
    desc: "Khách sạn nằm bên sông Hàn, tiện đi lại tới cầu Rồng và bãi biển.",
    pricePerNight: 1400000,
    beds: 1,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?river-hotel",
      "https://source.unsplash.com/random/800x600?danang-hotel"
    ],
    thumbnail: "https://images.unsplash.com/photo-1501117716987-c8e097e8a6e7?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 3,
    districtId: 5,
    avgRating: 4.5,
  },
  {
    id: "dalat-cabin-retreat",
    name: "Dalat Cabin Retreat",
    type: "Cabin",
    desc: "Cabin gỗ nhỏ xinh giữa rừng thông, yên tĩnh, thích hợp nghỉ dưỡng cuối tuần.",
    pricePerNight: 900000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?cabin",
      "https://source.unsplash.com/random/800x600?forest-cabin"
    ],
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: false,
    provinceId: 4,
    districtId: 7,
    avgRating: 4.7,
  },
  {
    id: "nhatrang-boutique",
    name: "Nha Trang Boutique Stay",
    type: "Boutique Hotel",
    desc: "Khách sạn thiết kế boutique, gần bãi biển, nhiều nhà hàng địa phương xung quanh.",
    pricePerNight: 800000,
    beds: 1,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?boutique-hotel",
      "https://source.unsplash.com/random/800x600?nha-trang"
    ],
    thumbnail: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 5,
    districtId: 8,
    avgRating: 4.2,
  },
  {
    id: "halong-luxury-suite",
    name: "Halong Luxury Suite",
    type: "Suite",
    desc: "Suite cao cấp với view vịnh và ban công rộng, dịch vụ spa tại chỗ.",
    pricePerNight: 3500000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?luxury-hotel",
      "https://source.unsplash.com/random/800x600?halong-bay"
    ],
    thumbnail: "https://images.unsplash.com/photo-1505691723518-36a1219e0e19?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 6,
    districtId: 9,
    avgRating: 4.9,
  },
  {
    id: "hn-boutique-hostel",
    name: "Hanoi Boutique Hostel",
    type: "Hostel",
    desc: "Hostel trẻ trung, phù hợp nhóm du lịch tiết kiệm, nằm gần các quán ăn đêm.",
    pricePerNight: 250000,
    beds: 4,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?hostel",
      "https://source.unsplash.com/random/800x600?hanoi-hostel"
    ],
    thumbnail: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 1,
    districtId: 1,
    avgRating: 4.1,
  },
  {
    id: "hcm-sky-condo",
    name: "Saigon Sky Condo",
    type: "Condo",
    desc: "Căn hộ cao cấp trên tầng cao, tầm nhìn thành phố, đầy đủ tiện nghi cho gia đình.",
    pricePerNight: 2000000,
    beds: 3,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?condo",
      "https://source.unsplash.com/random/800x600?city-view"
    ],
    thumbnail: "https://images.unsplash.com/photo-1505691723518-36a1219e0e19?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 2,
    districtId: 4,
    avgRating: 4.6,
  },
  {
    id: "dn-family-villa",
    name: "Danang Family Villa",
    type: "Villa",
    desc: "Villa rộng rãi cho gia đình, sân vườn và bếp đầy đủ, gần biển.",
    pricePerNight: 3200000,
    beds: 4,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?family-villa",
      "https://source.unsplash.com/random/800x600?villa-beach"
    ],
    thumbnail: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: true,
    provinceId: 3,
    districtId: 6,
    avgRating: 4.8,
  },
  {
    id: "dalat-ecolodge",
    name: "Dalat Ecolodge",
    type: "Ecolodge",
    desc: "Ecolodge thân thiện môi trường, sử dụng năng lượng tái tạo và thực phẩm địa phương.",
    pricePerNight: 950000,
    beds: 2,
    imageUrls: [
      "https://source.unsplash.com/random/800x600?ecolodge",
      "https://source.unsplash.com/random/800x600?dalat-nature"
    ],
    thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
    hasFreeWifi: false,
    provinceId: 4,
    districtId: 7,
    avgRating: 4.5,
  },
];

  // Create or update listings (idempotent)
  for (const listing of listingsData) {
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: {
        name: listing.name,
        type: listing.type,
        desc: listing.desc,
        pricePerNight: listing.pricePerNight,
        beds: listing.beds,
        imageUrls: listing.imageUrls ?? [],
        thumbnail: listing.thumbnail ?? null,
        hasFreeWifi: listing.hasFreeWifi ?? false,
        provinceId: listing.provinceId ?? null,
        districtId: listing.districtId ?? null,
        avgRating: listing.avgRating ?? 0,
      },
      create: {
        ...listing,
        imageUrls: listing.imageUrls ?? [],
      },
    });
  }

  // --------------------------------------
  // 5) GÁN AMENITIES NGẪU NHIÊN CHO MỖI LISTING
  // --------------------------------------
  const allListings = await prisma.listing.findMany();

  // Build relations array and batch insert with skipDuplicates
  const relationsData: { listingId: string; amenityId: string }[] = [];

  for (const listing of allListings) {
    const randomAmenities = amenityRecords
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    for (const a of randomAmenities) {
      relationsData.push({
        listingId: listing.id,
        amenityId: a.id,
      });
    }
  }

  if (relationsData.length > 0) {
    await prisma.listingAmenity.createMany({
      data: relationsData,
      skipDuplicates: true,
    });
  }

  console.log("✅ Seed completed!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
