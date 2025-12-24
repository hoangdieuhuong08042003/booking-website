import StatCard from './_component/stat-card';
import { Users, Image, Download, Eye } from 'lucide-react';
import UserGrowthChart from './_component/use-chart';
import MonthlyImageBarChart from './_component/image-chart';

export default function AdminPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen ">
      <div className="w-full p-4 mt-12 space-y-4">
        <h1 className="text-5xl font-bold">統計概要</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          システムの現在のパフォーマンスと目標に対する進捗状況を確認できます。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <StatCard
            title="月間アクティブユーザー数 (MAU)"
            value="1,000"
            icon={<Users className="text-blue-500" />}
          />
          <StatCard
            title="投稿された画像数"
            value="1,000"
            icon={<Image className="text-purple-400" />}
          />
          <StatCard
            title="月間画像ダウンロード数"
            value="1,000"
            icon={<Download className="text-orange-400" />}
          />
          <StatCard
            title="月間投稿閲覧数"
            value="1,000"
            icon={<Eye className="text-pink-400" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <UserGrowthChart />
          <MonthlyImageBarChart />
        </div>
      </div>
    </main>
  );
}
