// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../backendUtils/dbAccess"

type Data = {
  name: string
}

export default async function hashToMap(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {zkHash = ""} = req.query

  let dbData = await prisma.rainbowTable.findFirst({
    where: {
      hash: zkHash as string
    }
  });

  if (!dbData) {
    return res.send({"name": "Couldn't find it in our Rainbow Table!"})
  }

  return res.send({"name": dbData.name})
}
