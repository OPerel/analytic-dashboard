// export interface User {
//   _id: string,
//   createdAt: Date
// }

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

export interface ByDayAggregation {
  _id: string,
  count: number
}

export interface PageHitByUser {
  _id: { user: string },
  pageHitsCount: number,
  pageHits: PageHit[]
}