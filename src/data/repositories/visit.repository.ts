import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Visit } from "../entities/visit.model";

@Injectable()
export class VisitsRepository {
    constructor(@InjectModel(Visit.name) private readonly visitModel: Model<Visit>) {}

    async findForLink({linkId}:{linkId: number}) {
        return this.visitModel.find({linkId}).lean<Visit[]>;
    }
}