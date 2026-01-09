import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  try {
    await seedReviews();
    // Sau khi seed review, cập nhật avgRating cho tất cả listing
    const listings = await prisma.listing.findMany({ select: { id: true } });
    for (const listing of listings) {
      const avg = await prisma.review.aggregate({
        where: { listingId: listing.id },
        _avg: { stars: true },
      });
      await prisma.listing.update({
        where: { id: listing.id },
        data: { avgRating: avg._avg.stars ?? 0 },
      });
    }
  } catch (error) {
    console.error("❌ Seeding reviews failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
