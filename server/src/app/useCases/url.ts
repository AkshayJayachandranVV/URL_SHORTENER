import { UrlRepository } from "../../domain/repositories/urlRepository"
import {Url} from '../../domain/entities/IUrl'
import shortid from 'shortid'
import validator from 'validator';
export class UrlService {
    private urlRepo : UrlRepository

    constructor() {
        this.urlRepo = new UrlRepository()
    }

    async urlSHorten(data: Url) {
        try {
          console.log("Reached url service", data);
      
          const { url, email } = data; // Include userId if needed for ownership tracking
      
          if (!validator.isURL(url)) {
            return { success: false, message: 'Please provide a valid URL.' };
          }
      
          const urlCode = shortid.generate();
          const shortUrl = `https://url-shortener-eurt.onrender.com/${urlCode}`;

          const newUrl = {
            originalUrl: url,
            shortUrl,
            urlCode,
            owner: email,
            date: new Date(),
          };
      
          const result = await this.urlRepo.storeUrl(newUrl)
      
          // Return the response
          return {
            success: true,
            message: 'URL shortened successfully',
            shortUrl: shortUrl,
          };
        } catch (error) {
          console.error('Error in url shorten process:', error);
          return { success: false, message: 'An unexpected error occurred. Please try again later.' };
        }
      }



      async redirectUrl(code: string) {
        try {
          console.log("Reached url service redirect url", code);
      
          // Fetch the URL using the repository's findUrl method
          const result = await this.urlRepo.findUrl(code);
      
          if (result && result.success && result.data) {
            // If the URL is found, return the original URL
            return {
              success: true,
              message: "URL found successfully.",
              originalUrl: result.data.originalUrl,
            };
          } else {
            // If the URL is not found, return an error response
            return {
              success: false,
              message: "No URL found for the provided code.",
            };
          }
        } catch (error) {
          console.error("Error in redirect URL process:", error);
          return {
            success: false,
            message: "An unexpected error occurred. Please try again later.",
          };
        }
      }
      

}



