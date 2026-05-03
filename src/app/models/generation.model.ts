export interface GenerationItem {
  id: string;
  _id?: string;
  imageUrl: string;
  outputImage: string;
  furnitureImageUrl?: string;
  roomImageUrl?: string;
  roomImage?: string;
  outputImageUrl?: string;
  roomId?: string;
  prompt?: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface GenerateRequest {
  furnitureImage: File;
  roomImage?: File;
  prompt?: string;
  userId: string;
}

export interface BuildRoomApiRequest {
  roomImage?: File;
  furnitureItems: File[];
  roomType: string;
  styleId: string;
  styleName: string;
  stylePrompt: string;
  autoComplete: boolean;
  prompt?: string;
  userId: string;
  fromSketch?: boolean;
}

export interface GenerateResponse {
  id: string;
  imageUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface CleanupRequest {
  roomImage: File;
  maskImage: File;
  userId: string;
}

export interface StyleTransferRequest {
  roomImage: File;
  maskImage: File;
  styleDescription?: string;
  objectImage?: File;
  userId: string;
}

export interface PresetRoom {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: 'living' | 'bedroom' | 'kitchen' | 'office' | 'dining' | 'outdoor' | 'empty' | 'gaming' | 'bathroom' | 'buildings' | 'gardens';
}
