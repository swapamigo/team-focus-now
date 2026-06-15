
DROP POLICY IF EXISTS "anyone can insert feedback" ON public.feedback_responses;
CREATE POLICY "anyone can insert feedback"
ON public.feedback_responses
FOR INSERT
WITH CHECK (
  email IS NULL OR (
    length(email) BETWEEN 5 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);
