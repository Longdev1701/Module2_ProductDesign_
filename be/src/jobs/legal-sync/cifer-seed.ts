import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu đồng bộ dữ liệu CIFER...');
  
  const dataPath = 'C:\\Users\\A.Long\\OneDrive\\Desktop\\legal\\scraper_project\\data\\group3\\cifer_vietnam.json';
  if (!fs.existsSync(dataPath)) {
    console.error('Không tìm thấy file dữ liệu tại:', dataPath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(fileContent);
  const records = Array.isArray(parsed) ? parsed : (parsed.data || []);
  
  console.log(`Tìm thấy ${records.length} bản ghi CIFER.`);

  const orgs = await prisma.organization.findMany({
    select: { id: true, taxCode: true, name: true }
  });
  
  const taxCodeMap = new Map<string, string>();
  for (const org of orgs) {
    if (org.taxCode) {
      taxCodeMap.set(org.taxCode, org.id);
    }
  }

  let upsertedCount = 0;
  let linkedCount = 0;
  
  for (const item of records) {
    if (!item.china_reg_no) continue;
    
    let orgId: string | null = null;
    if (item.overseas_reg_no && taxCodeMap.has(item.overseas_reg_no)) {
      orgId = taxCodeMap.get(item.overseas_reg_no) || null;
      linkedCount++;
    }

    try {
      // Prisma client might not have CiferRegistry if generate failed. 
      // We'll cast it to any to bypass TS error if needed, but it should be generated.
      await (prisma as any).ciferRegistry.upsert({
        where: { chinaRegNo: item.china_reg_no },
        update: {
          no: item.no,
          country: item.country,
          category: item.category,
          overseasRegNo: item.overseas_reg_no,
          name: item.name,
          address: item.address,
          regDate: item.reg_date,
          expDate: item.exp_date,
          state: item.state,
          ...(orgId ? { organizationId: orgId } : {})
        },
        create: {
          no: item.no,
          country: item.country || 'Vietnam',
          category: item.category || 'Unknown',
          chinaRegNo: item.china_reg_no,
          overseasRegNo: item.overseas_reg_no,
          name: item.name || 'Unknown',
          address: item.address,
          regDate: item.reg_date,
          expDate: item.exp_date,
          state: item.state,
          organizationId: orgId
        }
      });
      upsertedCount++;
      if (upsertedCount % 500 === 0) {
        console.log(`Đã xử lý ${upsertedCount}/${records.length}...`);
      }
    } catch(err: any) {
       console.error(`Lỗi tại record ${item.china_reg_no}:`, err.message);
    }
  }

  console.log(`\n✅ Hoàn tất! Đã upsert ${upsertedCount} bản ghi vào bảng CiferRegistry.`);
  console.log(`🔗 Đã tự động liên kết (link) ${linkedCount} bản ghi với các Organization hiện có.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
