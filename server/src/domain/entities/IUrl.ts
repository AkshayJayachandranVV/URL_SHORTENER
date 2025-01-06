export interface Url {
    url:string,
    email:string
}


export interface NewUrl {
    originalUrl: string; 
    shortUrl: string;    
    urlCode: string;    
    owner?: string;      
    date: Date;          
  }
  