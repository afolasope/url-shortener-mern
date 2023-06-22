export type IShortUrls = {
  clicks: number;
  createdAt: string;
  fullUrl: string;
  shortUrl: string;
  _id: string;
  QRCode: string;
};

export type IHistory = {
  id: string;
  userId: string;
  fullUrl: string;
  shortUrl: string;
  os: string;
  browser: string;
  device: string;
  location: string;
  time: string;
};
