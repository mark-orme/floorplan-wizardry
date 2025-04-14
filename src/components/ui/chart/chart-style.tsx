
import * as React from "react"
import { ChartConfig, THEMES } from "./chart-context"
import DOMPurify from "dompurify"
import { sanitizeCss } from "@/utils/security/htmlSanitization"

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  // Generate CSS content
  const cssContent = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`
    )
    .join("\n")

  // First sanitize the generated CSS content
  const sanitizedCss = sanitizeCss(cssContent)
  
  // Then sanitize with DOMPurify as an additional layer of protection
  const fullySanitized = DOMPurify.sanitize(sanitizedCss, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: []  // No attributes allowed
  })

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: fullySanitized
      }}
    />
  )
}
