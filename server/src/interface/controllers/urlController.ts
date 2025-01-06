import {UrlService} from "../../app/useCases/url";
import { Request, Response } from 'express';

class UrlController {
    private urlService: UrlService;

    constructor(){
        this.urlService = new UrlService()
    }


    urlShorten =  async(req:Request,res:Response): Promise<void> =>{
        try {
            console.log(req.body)
            const data = req.body
            const result  = await this.urlService.urlSHorten(data);
            console.log(result)
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message || 'URL shortened successfully.',
                    shortUrl: result.shortUrl, // Send the shortened URL in the response
                  });
              } else {
                res.status(400).json({
                  success: false,
                  message: result.message || 'Failed to shorten URL.',
                });
              }
        } catch (error) {
            console.log("Error while URL shortening", error);
            res.status(500).json({
              success: false,
              message: 'An error occurred while shortening the URL.',
            });
        }
    }


}


export const urlController = new UrlController()