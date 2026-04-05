import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FilesFormat, uploadFilesToS3, uploadSingleAttachments } from "@api/cfdi";
import { Dispatch, SetStateAction } from "react";
import { getAttachments } from "./getAttachments";
import axios from "axios";
type Out = {
    obtainedCFDI: Attachment[];
};

type In = {
    filesFormat: FilesFormat[]
    files: File[]
    uuid: string | null
    setFiles: Dispatch<SetStateAction<File[]>>
    options?: SearchOptions & {
        overridePeriodDates?: boolean;
    };
};

export const uploadAttachments = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
    "cfdi/uploadAttachments",
    async ({ files, uuid, filesFormat, options, setFiles }, { rejectWithValue, getState, dispatch }) => {
        const { company, rfc } = getState().auth;
        if (!company || !rfc) {
            console.error("Error in getPolicy: no company or rfc selected");
            return rejectWithValue("Sin compañía o RFC");
        }

        try {
            const { urlMap } = await uploadSingleAttachments(filesFormat, company, uuid);

            const validFiles = files.filter((f) => !urlMap[f.name].startsWith("Error"))
            if (validFiles.length > 0) {
                await uploadFilesToS3(validFiles, urlMap);
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setFiles([]);
            const result = await dispatch(getAttachments({ uuid, options })).unwrap();

            return { obtainedCFDI: result.obtainedCFDI };
        } catch (error) {
            setFiles([]);
            let messageError = 'Error al cargar los adjuntos';
            if (axios.isAxiosError(error)) {
                const errorValue = error.response?.data?.Message ?? '';

                switch (true) {
                    case errorValue.includes('Attachments with file_name'):
                        messageError = 'Ya existe un archivo con el mismo nombre en este CFDI, renómbralo e inténtalo de nuevo';
                        break;

                    case errorValue.includes('Total attachments size'):
                        messageError = 'Solo está permitido subir hasta máximo 10MB de archivos por cada CFDI';
                        break;

                    default:
                        messageError = 'Error al cargar archivo';
                        break;
                }
            }
            return rejectWithValue(messageError);
        }
    }
);
