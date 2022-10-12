import fs from 'fs';
import openapiTS from 'openapi-typescript';
import path from 'path';
import colors from 'picocolors';

main().catch(error => {
  console.error('error', error);
});

async function main() {
  const swaggerDocAPIURL = 'https://bb-typing.tyu.wiki/typing-service/v3/api-docs';
  const apiSchemaFilePath = path.resolve(
    process.cwd(),
    'packages/ui/src/core/request/schema.d.ts'
  );

  const output = await openapiTS(swaggerDocAPIURL, {
    prettierConfig: path.resolve(process.cwd(), './.prettierrc'),
    version: 3
  });

  fs.writeFileSync(apiSchemaFilePath, output, 'utf-8');

  console.log(
    colors.cyan(`schema 文件更新成功，路径于 ${colors.blue(apiSchemaFilePath)}\n`)
  );
}
