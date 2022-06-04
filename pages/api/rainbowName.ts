// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../backendUtils/dbAccess"
import { useRouter } from "next/router";
import { URLSearchParams } from 'url';

type Data = {
  name: string
}

export default async function rainbowName(req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = JSON.parse(req.body)
  if (!("zkUrl" in body)) {
    return res.send({"name": "ZK Url not submitted to API!"})
  }

  const urlParams = new URLSearchParams(body["zkUrl"])
  const zkHash = urlParams.get('hash')

  let dbData = await prisma.rainbowTable.findFirst({
    where: {
      hash: zkHash
    }
  });

  if (!dbData) {
    return res.send({"name": "Couldn't find it in our Rainbow Table :("})
  }

  return res.send({"name": dbData.name})
}
