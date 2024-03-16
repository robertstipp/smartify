import fs from 'fs';
import path from 'path';

export const getToken = () : string => {
  const tokenData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../token.json'), 'utf8'));
  return  tokenData.access_token; 
}