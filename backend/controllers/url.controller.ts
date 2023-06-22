import shortid from 'shortid';
import { ShortUrl } from '../models/url.model';
import { User } from '../models/user';
import { Types } from 'mongoose';
import geoip from 'geoip-lite';
import { History } from '../models/history';
import DeviceDetector from 'node-device-detector';
import Cache from '../config/redis.config';
import validator from 'validator';

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

export const createShortUrl = async (req: any, res: any) => {
  const { fullUrl, customUrl } = req.body;
  const userId = req?.headers['x-user-id'];
  let userEmail;

  if (req.user) {
    let { email } = req?.user;
    userEmail = email;
  }

  const validFullUrl = validator.isURL(fullUrl);
  if (!validFullUrl) {
    return res.status(401).send({ message: 'Invalid link' });
  }
  console.log(userId);
  const checkXUser = await User.findOne({ _id: userId });
  const validUser = await User.findOne({ email: userEmail });
  const checkCustomUrl = await ShortUrl.findOne({ shortUrl: customUrl });
  if (checkCustomUrl) {
    return res.status(400).send({ message: 'Custom url  is not available' });
  }

  if (validUser) {
    const url = await ShortUrl.create({
      shortUrl: customUrl ? customUrl : shortid.generate(),
      fullUrl,
      userId: validUser?._id,
    });
    return res.status(200).json(url);
  }

  if (checkXUser) {
    const url = await ShortUrl.create({
      shortUrl: customUrl ? customUrl : shortid.generate(),
      fullUrl,
      userId: new Types.ObjectId(userId),
    });
    return res.status(200).json(url);
  }

  if (!checkXUser && !validUser) {
    await User.create({
      _id: new Types.ObjectId(userId),
      email: 'anonymous@gmail.com',
      password: 'xoxoxo',
    });
    const url = await ShortUrl.create({
      shortUrl: customUrl ? customUrl : shortid.generate(),
      fullUrl,
      userId: new Types.ObjectId(userId),
    });
    return res.status(200).json(url);
  }
};

export const getShortUrl = async (req: any, res: any) => {
  const XUserId = req?.headers['x-user-id'];
  let userEmail;

  if (req.user) {
    let { email } = req?.user;
    userEmail = email;
  }

  const validUser = await User.findOne({ email: userEmail });

  const XUserUrls = await ShortUrl.find({ userId: XUserId });
  const authUrls = await ShortUrl.find({ userId: validUser?._id });

  if (XUserId) {
    return res.status(200).send(XUserUrls);
  }
  if (validUser) {
    return res.status(200).send(authUrls);    
  }
  return res.status(200).send([]);
};

export const deleteUrl = async (req: any, res: any) => {
  const { shortUrl } = req.params;
  const { email } = req.user;

  await Cache.redis?.del('auth-urls');

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  const validOwner = await ShortUrl.deleteOne({
    userId: new Types.ObjectId(user?._id),
    shortUrl: shortUrl,
  });

  await History.deleteMany({ shortUrl });
  if (!validOwner) {
    return res.status(400).send({ message: 'No urls match the ID provided' });
  }
  await Cache.redis?.del(`cache-${shortUrl}`);

  return res.status(200).send({ message: 'deletion successful' });
};




export const redirectUrl = async (req: any, res: any) => {
  const { shortUrl } = req.params;
  const url = await ShortUrl.findOne({ shortUrl });

  const cacheKey = `cache-${shortUrl}`;
  // Cache.redis?.get(cacheKey);

  if (!url) {
    return res.status(404);
  }

  var ip = '102.219.54.33';
  const geo = geoip.lookup(ip);
  await ShortUrl.updateOne({ shortUrl }, { $set: { clicks: +url.clicks + 1 } });
  const userAgent = req.headers['user-agent'];
  const { os, client, device } = detector.detect(userAgent);

  await History.create({
    shortUrl: url.shortUrl,
    fullUrl: url.fullUrl,
    device: device.type,
    brand: device.brand,
    os: os.name,
    browser: client.name,
    location: `${geo?.city}, ${geo?.country}`,
    userId: new Types.ObjectId(url?.userId as string),
  });
  // Cache.redis?.set(cacheKey, JSON.stringify(url));

  return res.status(301).redirect(url?.fullUrl);
};



