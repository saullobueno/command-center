import { SITES } from './sites'

export const SITE_NAME_BY_ID: Record<string, string> = Object.fromEntries(
  SITES.map((site) => [site.id, site.name]),
)
