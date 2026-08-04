import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Schema validation
const ChatMessageSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
});

// Mock AI analysis result
const CONTRACT_ANALYSIS_RESULT = {
  title: 'Báo cáo Rủi ro Phân phối - Nghị định EUDR & Thương mại 2024',
  items: [
    {
      status: 'error',
      text: 'Điều khoản bồi thường (Mục 4.2) không tuân thủ Nghị định mới về giới hạn trách nhiệm.',
    },
    {
      status: 'success',
      text: 'Quy định về giải quyết tranh chấp trọng tài hợp lệ.',
    },
    {
      status: 'warning',
      text: 'Cần bổ sung phụ lục kê khai minh bạch nguồn gốc vùng trồng cà phê.',
    },
    {
      status: 'warning',
      text: 'Thiếu thông tin hiệu lực pháp lý (Ngày tháng, chữ ký).',
    },
  ],
  pdfName: 'Bao_cao_danh_gia_rui_ro_hop_dong.pdf',
  fullContent: {
    title: 'Báo cáo Rủi ro Phân phối - Nghị định EUDR & Thương mại 2024',
    sections: [
      {
        heading: 'Điều khoản bồi thường & Thẩm định pháp lý (Mục 4.2)',
        content:
          'Hợp đồng quy định giới hạn trách nhiệm bồi thường của Bên A tối đa không quá 10% giá trị lô hàng và buộc Bên B tự chịu toàn bộ chi phí lưu kho, phạt hành chính hay tiêu hủy tại EU. Điều này không tuân thủ Nghị định mới về giới hạn trách nhiệm, do vi phạm EUDR có thể dẫn đến việc tịch thu toàn bộ lô hàng cùng mức phạt rất lớn, vượt xa trần 10% và đẩy toàn bộ rủi ro pháp lý về phía Bên B.',
        status: 'error',
      },
      {
        heading: 'Quy định về giải quyết tranh chấp trọng tài hợp lệ (Mục 6.2)',
        content:
          'Hợp đồng chỉ định rõ Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) hoặc Trọng tài Quốc tế Singapore (SIAC) theo Quy tắc UNCITRAL làm cơ quan giải quyết tranh chấp, đảm bảo tính hợp lệ và khả năng thi hành án xuyên biên giới.',
        status: 'success',
      },
      {
        heading: 'Cần bổ sung phụ lục kê khai minh bạch nguồn gốc vùng trồng cà phê (Mục 2.2)',
        content:
          'Hợp đồng hiện chỉ thỏa thuận kê khai mã vùng trồng tổng quát cấp Huyện/Tỉnh. Để đáp ứng tiêu chuẩn EUDR bắt buộc, Bên A phải bổ sung Phụ lục dữ liệu địa không gian (Geolocational Data) chứa tọa độ GPS chính xác (dạng Polygon cho diện tích > 4ha) của từng thửa đất thu hoạch.',
        status: 'warning',
      },
      {
        heading: 'Thiếu thông tin hiệu lực pháp lý (Phần Cuối Hợp Đồng & Ngày Tháng)',
        content:
          'Văn bản hiện tại thiếu ngày tháng có hiệu lực cụ thể của hợp đồng (chỉ có ngày lập ở phần mở đầu) và phần đại diện hai bên mới chỉ hiển thị tên/chức vụ đại diện mà thiếu chữ ký tay/chữ ký số và con dấu pháp nhân thực tế, dẫn đến rủi ro bị tranh chấp về thời điểm phát sinh hiệu lực và tính xác thực pháp lý khi đưa vào thực thi.',
        status: 'warning',
      },
    ],
  },
};

// POST /api/chat - Send message and get AI response
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Message is required' } });
      return;
    }

    // Get or create session
    let chatSession;
    if (sessionId) {
      chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        },
      });
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        sender: 'USER',
        text: message,
        attachmentUrl: req.file ? `/uploads/${req.file.filename}` : null,
        attachmentName: req.file?.originalname,
      },
    });

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Integrate real AI/LLM for contract analysis
    // For now, return mock data
    const aiResponse = CONTRACT_ANALYSIS_RESULT;

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        sender: 'AI',
        text: 'Tôi đã phân tích xong hợp đồng. Dưới đây là kết quả đánh giá rủi ro pháp lý chi tiết:',
        reportData: aiResponse,
      },
    });

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: { updatedAt: new Date() },
    });

    res.json({
      text: 'Tôi đã phân tích xong hợp đồng. Dưới đây là kết quả đánh giá rủi ro pháp lý chi tiết:',
      report: aiResponse,
      sessionId: chatSession.id,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process chat message',
      },
    });
  }
});

// GET /api/chat/sessions - Get all chat sessions
router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch sessions' },
    });
  }
});

// GET /api/chat/sessions/:id - Get a specific session with messages
router.get('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Session not found' } });
      return;
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch session' },
    });
  }
});

// DELETE /api/chat/sessions/:id - Delete a chat session
router.delete('/sessions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.chatMessage.deleteMany({ where: { sessionId: id } });
    await prisma.chatSession.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete session' },
    });
  }
});

export default router;
