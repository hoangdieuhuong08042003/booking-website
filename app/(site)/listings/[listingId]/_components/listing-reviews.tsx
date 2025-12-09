import Image from "next/image";
import { getListingReviews } from "@/app/_actions/review/review-actions";

type Props = { listingId: string };

export default async function ListingReviews({ listingId }: Props) {
  const reviews = await getListingReviews(listingId);

  if (!reviews.length) {
    return (
      <section className="mt-8">
        <h3 className="text-xl font-semibold">Đánh giá</h3>
        <p className="text-sm text-muted-foreground mt-2">Chưa có đánh giá.</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold">Đánh giá</h3>
      <ul className="mt-4 space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="flex gap-3 border p-3 rounded-lg">
            {review.user?.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name ?? "user"}
                width={32}
                height={32}
                className="rounded-full object-cover h-12 w-12"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {review.user?.name ?? "Khách"}
                </div>
              </div>
              <div className="text-sm text-yellow-600">
                {"★".repeat(review.stars)}
              </div>
              <p className="text-sm mt-1 whitespace-pre-line">{review.text}</p>
              <div className="text-sm text-muted-foreground mt-1">
                {review.createdAt.toLocaleDateString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
