export interface User {
  _id: string,
  createdAt: Date
}

export interface PageHit {
  _id: string,
  userId: string,
  referrer: string,
  platform: string,
  country: string,
  city: string,
  flagSVG: string,
  createdAt: Date,
  IP: string 
}