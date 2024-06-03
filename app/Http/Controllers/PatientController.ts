import { Request, Response } from "express";
import { PatientModel } from "../../Models/PatientModel";
import { DB } from "../../helpers/DB";
import { JWT } from "../../helpers/JWT";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";

export class PatientController extends PatientModel {

    // public async appointmentAvailables(): Promise<APPOINTMENT_DATE_TYPE[]> {
    //     return await DB.table('AppointmentDates')
    //         .with(['Months', 'Hours', 'Years'])
    //         .where('available', true).get<APPOINTMENT_DATE_TYPE>();
    // }

    // getPatients = async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         if (!(await JWT.validatePermission(req.headers.authorization, 'PATIENT-READ'))) {
    //             return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
    //         }
    //         return res.status(200).json(await this.with(['Departments', 'Insurances']).get());
    //     } catch (error: any) {
    //         return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    //     }
    // };

    // getPatient = async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         if (!(await JWT.validatePermission(req.headers.authorization, 'PATIENT-READ'))) {
    //             return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
    //         }
    //         const ID: number = parseInt(req.params.id);
    //         return res.status(200).json(await this.where('id', ID).get());
    //     } catch (error: any) {
    //         return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    //     }
    // };

    // storePatient = async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         if (!(await JWT.validatePermission(req.headers.authorization, 'PATIENT-CREATE'))) {
    //             return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
    //         }

    //         const DATA: PATIENT_TYPE = req.body;
    //         const SAVE = await this.create(DATA);
    //         if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

    //         //const SEND_NEW = Object.values(await this.with(['Departments', 'Insurances']).where('id', SAVE.id).get())[0];
    //         //WebSocketProvider.storeAction(SEND_NEW, 'Patients');
    //         return res.status(201).json(SAVE);
    //     } catch (error) {
    //         return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    //     }
    // };

    // updatePatient = async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         if (!(await JWT.validatePermission(req.headers.authorization, 'PATIENT-UPDATE'))) {
    //             return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
    //         }
    //         const ID: number = parseInt(req.params.id);
    //         const NEW_DATA: PATIENT_TYPE = req.body;

    //         const SAVE = await this.update(ID, NEW_DATA);
    //         if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

    //         return res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED });
    //     } catch (error: any) {
    //         return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    //     }
    // };

    // deletePatient = async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         if (!(await JWT.validatePermission(req.headers.authorization, 'PATIENT-DELETE'))) {
    //             return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
    //         }

    //         const ID: number = parseInt(req.params.id);
    //         const DELETE = await this.delete(ID);

    //         if (DELETE.error) return res.status(409).json({ error: { message: DELETE.error } });

    //         return res.status(204).json({ message: SUCCESS_MESSAGES.DELETED });
    //     } catch (error: any) {
    //         return res.status(401).json({ error: { message: error } });
    //     }
    // };
}
