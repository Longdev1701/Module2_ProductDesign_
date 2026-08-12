import cron from 'node-cron';
import { LegalSyncService } from './service';

export function initLegalSyncCron(): void {
  // Kích hoạt cào & đồng bộ tin tức ban đầu ngay khi backend server khởi động
  LegalSyncService.runSync('startup-sync')
    .then((summary) => {
      console.log(`[LegalSyncCron] Đồng bộ khởi động hoàn tất: ${summary.insertedCount} tin mới, ${summary.publishedCount} đã xuất bản.`);
    })
    .catch((err: any) => {
      console.error('[LegalSyncCron] Lỗi khi đồng bộ khởi động:', err?.message || err);
    });

  // Lịch chạy định kỳ: 02:00 UTC hàng ngày ('0 2 * * *')
  cron.schedule('0 2 * * *', async () => {
    console.log('[LegalSyncCron] Bắt đầu đồng bộ tin tức pháp lý định kỳ...');
    try {
      const summary = await LegalSyncService.runSync('cron-worker');
      console.log(`[LegalSyncCron] Đồng bộ thành công: ${summary.insertedCount} tin mới, ${summary.publishedCount} đã xuất bản.`);
    } catch (err: any) {
      console.error('[LegalSyncCron] Lỗi khi chạy cron job:', err?.message || err);
    }
  });

  console.log('⏰ Legal Sync Cron Job initialized (Schedule: Daily at 02:00 UTC)');
}
