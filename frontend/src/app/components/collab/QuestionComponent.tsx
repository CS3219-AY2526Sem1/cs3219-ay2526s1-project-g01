import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Difficulty } from "@/types/difficulty";

export default function QuestionComponent() {
  return (
    <Card className="h-full flex flex-col bg-stone-900 border-black">
      {/* Criteria */}
      <CardHeader>
        <CardTitle className="text-white text-4xl">Two Sum</CardTitle>
        <div className="flex pt-5 items-start gap-2">
          <Badge className={Difficulty.HARD}>Difficult</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        {/* Question Description */}
        <div className="flex-1 text-white">
          Description : We, the citizens of Singapore, pledge ourselves as one
          united people, regardless of race, language or religion, to build a
          democratic society based on justice and equality so as to achieve
          happiness, prosperity and progress for our nation.
        </div>

        {/* Examples Section */}
        <div className="flex-1 mt-5 p-2 bg-black text-white rounded-lg text-sm">
          Input : Test case 1 Output : Correct answer Explanation : Because it
          is correct
        </div>

        {/* Constraints Section */}
        <div className="mt-5 p-2 flex-1 text-white">
          1 is less than n There will be a total of 1 trillion test cases
        </div>
      </CardContent>
    </Card>
  );
}
