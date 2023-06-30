import { History } from '../models/history';
import { User } from '../models/user';

export const getHistory = async (req: any, res: any) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send('unauthorized');
  }

  const history = (await History.find({})).reverse();
  console.log(history);
  return res.status(200).send(history);
};

export const getHistoryById = async (req: any, res: any) => {
  const { shortUrl } = req.params;
  const { email } = req.user;
  const verifyUser = await User.findOne({ email });
  if (!verifyUser) {
    return res.status(401);
  }
  const history = await History.find({ shortUrl });
  return res.status(200).send(history);
};
