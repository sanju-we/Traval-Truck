import { IReplay } from "@core/interface/modelInterface/IReplay";


export interface ReplayDTO{
  comment:string,
  id:string,
  reviewId:string,
  replayer:string,
}

export const toReplayDTO = (replay:IReplay):ReplayDTO => ({
  comment:replay.comment,
  reviewId:replay.reviewId,
  id:replay._id.toString(),
  replayer:replay.replayer
})