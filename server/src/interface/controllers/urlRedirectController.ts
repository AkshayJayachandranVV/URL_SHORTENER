import {UrlService} from "../../app/useCases/url";
import { Request, Response } from 'express';

class UrlRedirectController {
    private urlService: UrlService;

    constructor(){
        this.urlService = new UrlService()
    }
   
   
    urlRedirect =  async(req:Request,res:Response): Promise<void> =>{
        try {
            console.log(req.params)
            const { code } = req.params;
            const result  = await this.urlService.redirectUrl(code);
            console.log(result)
            if (result.success && result.originalUrl) {
                res.redirect(result.originalUrl);
              } else {
                res.status(404).json({
                    success: false,
                    message: result.message || 'The URL code provided does not exist.',
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

export const urlRedirectController = new UrlRedirectController()