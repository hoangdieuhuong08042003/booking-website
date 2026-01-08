import { getListingReviews } from "@/app/_actions/review/review-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            {/* Avatar user */}
            <Avatar className="size-10 cursor-pointer hover:border-2 hover:border-gray-500">
              <AvatarImage
                src={review.user?.image ?? ""}
                alt={review.user?.name?.charAt(0).toUpperCase() ?? "U"}
              />
              <AvatarFallback className="bg-blue-400 text-white">
                {review.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
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
