/* eslint-disable @typescript-eslint/no-explicit-any */
// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';
import {Mail} from '../models';
const sgMail = require('@sendgrid/mail');

// import {inject} from '@loopback/core';

export class SendgridController {
  constructor() {}

  @post('/mail', {
    responses: {
      '200': {
        description: 'Login Mascota Feliz',
      },
    },
  })
  async mail(@requestBody() datamail: Mail) {
    sgMail.setApiKey('API SENGRID');
    const msg = {
      to: datamail.to,
      from: 'CORREO VERIFICADO SENDGRID',
      subject: datamail.subject + ' - Mascota Feliz',
      //text: datamail.text, ${datamail.text}
      html: `<table bgcolor="#F6F5FF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
      style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F6F5FF; width: 100%;"
      valign="top" width="100%">
      <tbody>
        <tr style="vertical-align: top;" valign="top">
          <td style="word-break: break-word; vertical-align: top;" valign="top">
            <div style="background-color:#e9f5ff;border-radius: 30px 30px 0 0; padding-top: 50px;">
              <div class="block-grid"
                style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #1588c8;border-radius: 18px 18px 0 0;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;background-color:#1588c8;border-radius: 30px 30px 0 0;">
                  <div class="col num12"
                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;border-radius: 30px 30px 0 0;">
                    <div style="width:100% !important;border-radius: 30px 30px 0 0;">
                      <div
                        style="color:#fff;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-top:10px;padding-left:10px;">
                        <div
                          style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.2; color: #fff; mso-line-height-alt: 14px;">
                          <div align="center" class="img-container center autowidth"
                            style="padding-right: 5px;padding-left: 5px;">
                            <div style="font-size:1px;line-height:5px"></div>
                            <a href="#" tabindex="-1" target="_blank">
                              <img align="center" alt="Logo" border="0" class="center autowidth"
                                src="https://mymascotafeliz.000webhostapp.com/assets/img/logo.png"
                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; width: 100px; max-width: 320px; display: block;"
                                title="Logo" width="320" />
                            </a>
                            <div style="font-size:1px;line-height:5px"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="background-color:#e9f5ff;">
              <div class="block-grid"
                style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                  <div class="col num12"
                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                    <div style="width:100% !important;">
                      <div
                        style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:30px; padding-right: 30px; padding-left: 30px;">
                        <div
                          style="color:#B1AED1;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:5px;padding-left:10px;">
                          <div
                            style="line-height: 1.2; font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; color: #B1AED1; mso-line-height-alt: 14px;">
                            <p
                              style="line-height: 1.2; text-align: center; font-size: 20px; mso-line-height-alt: 24px; margin: 0;">
                              <span style="font-size: 20px;">NOTIFICACIONES</span>
                            </p>
                          </div>
                        </div>
                        <div
                          style="color:#454562;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:5px;padding-bottom:5px;padding-left:5px;">
                          <div
                            style="line-height: 1.2; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; font-size: 12px; color: #454562; mso-line-height-alt: 14px;">
                            <p
                              style="line-height: 1.2; text-align: center; font-size: 38px; mso-line-height-alt: 46px; margin: 0;">
                              <span style="font-size: 38px;">${datamail.subject}</span>
                            </p>
                          </div>
                        </div>
                        <div
                          style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.5;padding-top:10px;padding-right:25px;padding-bottom:10px;padding-left:25px;">
                          <div
                            style="font-size: 14px; line-height: 1.5; font-family: 'Open Sans', Helvetica, Arial, sans-serif; color: #555555; mso-line-height-alt: 21px;">
                            <p
                              style="font-size: 14px; line-height: 1.5; text-align: center; mso-line-height-alt: 21px; margin: 0;">
                              ${datamail.text}</p>
                          </div>
                          <div
                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:10px; padding-right: 30px; padding-left: 30px;">
                            <div align="center" class="button-container"
                              style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                              <a href="https://mymascotafeliz.000webhostapp.com/"
                                style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #1588c8; background-color: transparent; border-radius: 50px; -webkit-border-radius: 50px; -moz-border-radius: 50px; width: auto; width: auto; border-top: 2px solid #1588c8; border-right: 2px solid #1588c8; border-bottom: 2px solid #1588c8; border-left: 2px solid #1588c8; padding-top: 5px; padding-bottom: 5px; font-family: 'Open Sans', Helvetica, Arial, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;margin-top: 22px;"
                                target="_blank"><span
                                  style="padding-left:50px;padding-right:50px;font-size:16px;display:inline-block;">
                                  <span style="font-size: 16px; line-height: 2; mso-line-height-alt: 32px;"><strong>Ir
                                      Mascota Feliz</strong></span>
                                </span></a>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="background-color:#e9f5ff;margin-bottom: 60px;border-radius: 0 0 30px 30px;">
              <div class="block-grid"
                style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #1588c8;border-radius: 0 0 18px 18px;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;background-color:#1588c8;border-radius: 0 0 30px 30px;">
                  <div class="col num12"
                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;border-radius: 0 0 30px 30px;">
                    <div style="width:100% !important;border-radius: 0 0 30px 30px;">
                      <div
                        style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:35px; padding-bottom:25px; padding-right: 25px; padding-left: 25px;">

                        <div
                          style="color:#fff;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                          <div
                            style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.2; color: #fff; mso-line-height-alt: 14px;">
                            <p
                              style="font-size: 18px; line-height: 1.2; text-align: center; mso-line-height-alt: 22px; margin: 0;">
                              <span style="font-size: 18px;"><strong>Mascota Feliz
                                </strong>EPS para mascotas.</span>
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>`,
    };

    return sgMail.send(msg, (error: any, result: any) => {
      if (error) {
        return error;
      } else {
        return result;
      }
    });
  }
}
