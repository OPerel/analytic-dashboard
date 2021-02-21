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
  createdAt: string,
  IP: string 
}

export interface ByDayAggregation {
  _id: string,
  count: number,
  date: string
}

export interface PageHitByUser {
  _id: { user: string },
  pageHitsCount: number,
  firstHit: string,
  pageHits: PageHit[]
}