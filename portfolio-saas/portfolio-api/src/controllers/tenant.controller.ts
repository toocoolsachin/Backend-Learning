import { Request, Response } from 'express'
import prisma from '../../lib/prisma'

export async function createTenant(req: Request, res: Response) {
  const { name, bio, skills } = req.body

  if (!name || !bio || !skills) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-')

  const template = await prisma.template.findFirst()
  if (!template) {
    return res.status(500).json({ error: 'No template found' })
  }

  const tenant = await prisma.tenant.create({
    data: {
      slug,
      name,
      bio,
      skills,
      templateId: template.id,
    },
  })

  res.json({ slug: tenant.slug })
}

export async function getTenant(req: Request, res: Response) {
  const slug = req.params.slug

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug parameter' })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  })

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' })
  }

  const template = await prisma.template.findUnique({
    where: { id: tenant.templateId },
  })

  res.json({ tenant, template })
}
