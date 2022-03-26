import {
  LambdaClient,
  GetFunctionConfigurationCommand,
  UpdateFunctionConfigurationCommand,
} from "@aws-sdk/client-lambda";
import { FULL_WORD_LIST } from "@nickhudkins/word-list";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleInPlace(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const FunctionName = "wordle-api";

export const handler = async () => {
  const client = new LambdaClient({ region: "us-east-1" });
  const config = await client.send(
    new GetFunctionConfigurationCommand({
      FunctionName,
    })
  );
  const envVars = config.Environment?.Variables;
  const correctWord = envVars?.["CORRECT_WORD"] || "";
  const revision = parseInt(envVars?.["REVISION"] || "0", 10);

  console.log("=============🥱 CURRENT 🥱===============");
  console.log(`WORD: ${correctWord}`);
  console.log(`REVISION: ${revision.toString()}`);
  console.log("========================================");

  const nextRevision = revision + 1;
  shuffleInPlace(FULL_WORD_LIST);
  const nextWord = FULL_WORD_LIST[getRandomInt(0, FULL_WORD_LIST.length - 1)];
  console.log("===============✨ NEW ✨=================");
  console.log(`WORD: ${nextWord}`);
  console.log(`REVISION: ${nextRevision.toString()}`);
  console.log("========================================");

  await client.send(
    new UpdateFunctionConfigurationCommand({
      FunctionName,
      Environment: {
        ...config.Environment,
        Variables: {
          ...config.Environment?.Variables,
          ["CORRECT_WORD"]: nextWord,
          ["REVISION"]: nextRevision.toString(),
        },
      },
    })
  );

  console.log("==============✅ ALL DONE===============");
};
