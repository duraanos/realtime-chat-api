import { Request, Response } from 'express';
import { fileService } from '../services/file.service';

export const uploadController = {
  async uploadFile(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ message: 'No file found to upload ' });
      return;
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'audio/mpeg',
      'video/mp4',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      res.status(400).json({ message: 'Unsupported file type' });
      return;
    }
    try {
      const userId = (req as any).user.id;

      const { fileUrl, fileName } = await fileService.uploadFileToSupabase(
        req.file,
        userId
      );

      res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl,
        fileName,
        fileMimeType: req.file.mimetype,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },
};
