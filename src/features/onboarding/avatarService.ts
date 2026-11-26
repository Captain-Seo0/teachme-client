import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { supabase } from '@/lib/supabase';

import {
  AVATAR_BUCKET,
  AVATAR_FILE_NAME,
  AVATAR_JPEG_QUALITY,
  AVATAR_PHOTO_SIZE,
} from './constants';

export type PickResult =
  | { status: 'picked'; uri: string }
  | { status: 'cancelled' }
  | { status: 'denied'; canAskAgain: boolean };

/** Converts any image to a centered square, 512 x 512 JPEG and returns its local uri. */
async function toSquareJpeg(uri: string, width: number, height: number): Promise<string> {
  const side = Math.min(width, height);
  const context = ImageManipulator.ImageManipulator.manipulate(uri);
  if (width !== height) {
    context.crop({
      originX: Math.floor((width - side) / 2),
      originY: Math.floor((height - side) / 2),
      width: side,
      height: side,
    });
  }
  context.resize({ width: AVATAR_PHOTO_SIZE, height: AVATAR_PHOTO_SIZE });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({
    format: ImageManipulator.SaveFormat.JPEG,
    compress: AVATAR_JPEG_QUALITY,
  });
  return saved.uri;
}

/** Asks for gallery access, lets the user pick a photo, and returns it as a 512px square JPEG. */
export async function pickAvatarPhoto(): Promise<PickResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return { status: 'denied', canAskAgain: permission.canAskAgain };

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (result.canceled || result.assets.length === 0) return { status: 'cancelled' };

  const asset = result.assets[0];
  const uri = await toSquareJpeg(asset.uri, asset.width, asset.height);
  return { status: 'picked', uri };
}

/**
 * Uploads the local JPEG to avatars/{userId}/avatar.jpg (upsert) and returns its public URL
 * with a `?v=` cache-busting suffix. Throws on failure.
 */
export async function uploadAvatar(userId: string, localUri: string): Promise<string> {
  const path = `${userId}/${AVATAR_FILE_NAME}`;
  const body = await (await fetch(localUri)).arrayBuffer();

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, body, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
