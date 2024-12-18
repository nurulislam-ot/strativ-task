import { Controller, useForm } from "react-hook-form"

import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAnswerStore } from "@/state/answers"
import { Textarea } from "@/components/ui/textarea"
import { SubmitAnswerPayloadI } from "@/interface/answer"
import { useAuthenticationStore } from "@/state/authentication"
import InputErrorMessage from "@/components/input-error-message"
import useGetMyAnswerByQuestionId from "@/hooks/use-get-my-answer-by-quid"

interface AnswerFormPropsI {
  isAnswerUpdating: boolean
  questionId: string
}

export default function AnswerForm({
  questionId,
  isAnswerUpdating
}: AnswerFormPropsI) {
  const { submitAnswer } = useAnswerStore()
  const { authenticatedUser } = useAuthenticationStore()
  const myAnswer = useGetMyAnswerByQuestionId(questionId)
  const { control, handleSubmit } = useForm<SubmitAnswerPayloadI>({
    defaultValues: {
      answer: myAnswer?.answer || "",
      questionId,
      answeredUserId: authenticatedUser?.id
    }
  })

  const submitAnswerHandler = (data: SubmitAnswerPayloadI) => {
    submitAnswer(data)

    toast({
      title: "Answer submitted",

      description: "Your answer has been submitted successfully"
    })
  }

  const isFormDisabled = isAnswerUpdating || myAnswer?.answer ? true : false

  return (
    <form
      className="w-[600px] mt-auto"
      onSubmit={handleSubmit(submitAnswerHandler)}
    >
      <div className="flex flex-col">
        <Controller
          control={control}
          name="answer"
          rules={{ required: "Answer is required" }}
          render={({ field, fieldState: { error } }) => (
            <div className="grid w-full gap-1.5 mb-3">
              <Label htmlFor="answer">Your Answer</Label>
              <Textarea
                disabled={isFormDisabled}
                placeholder="Bangladesh is located in Asia"
                id="answer"
                rows={4}
                {...field}
              />
              <InputErrorMessage error={error} />
            </div>
          )}
        />
      </div>
      <div className="flex gap-2">
        <Button disabled={isFormDisabled} type="submit">
          Submit
        </Button>
      </div>
    </form>
  )
}
