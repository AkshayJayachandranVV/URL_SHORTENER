import {Url} from '../../models/urlModel'
import {NewUrl} from '../entities/IUrl'

export class UrlRepository {

    async storeUrl (data:NewUrl) {
        try {
            console.log("eneterd to Repo",data)

            const result = await Url.create(data)
            return result
        } catch (error) {
            console.error('Error creating temporary user:', error);
            throw new Error('An error occurred while creating the temporary user. Please try again later.');
        }
    }


    async findUrl(code: string) {
        try {
          // Find the URL in the database using the provided urlCode
          const result = await Url.findOne({ urlCode: code });
      
          if (!result) {
            return {
                success: false,
                message: 'URL not found.',
              };
          }
      
          // Return the found URL
          return {
            success: true,
            message: 'URL retrieved successfully.',
            data: result,
          };
        } catch (error) {
          console.error('Error finding URL:', error);
          return {
            success: false,
            message: 'An error occurred while finding the URL. Please try again later.',
          };
        }
      }
      

  


}   