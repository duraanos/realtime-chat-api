import { supabase } from '../config/supabase';
import { Express } from 'express';

export const fileService = {
  async uploadFileToSupabase(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uniqueFileName = `${userId}/${Date.now}-${file.originalname.replace(
      / /g,
      '_'
    )}`;

    const { error } = await supabase.storage
      .from('realtime-chat-bucket')
      .upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
      });

    if (error) throw new Error('Supabase upload error');

    const { data: publicURLData } = supabase.storage
      .from('realtime-chat-bucket')
      .getPublicUrl(uniqueFileName);

    return {
      fileUrl: publicURLData.publicUrl,
      fileName: uniqueFileName,
    };
  },
};
