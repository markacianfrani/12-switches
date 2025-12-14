> A psychologist friend at Bell Telephone Laboratories once built a machine with about 12 switches and a red and a green light. You set the switches, pushed a button, and either you got a red or a green light. After the first person tried it twenty times they wrote a theory of how to make the green light come on. The theory was given to the next victim and they had their twenty tries and wrote their theory, and so on endlessly. The stated purpose of the test was to study how theories evolved.

> But my friend, being the kind of person he was, had connected the lights to a random source! One day he observed to me that no person in all the tests (and they were all high class Bell Telephone Laboratories scientists) ever said there was no message. I promptly observed to him not one of them was either a statistician or an information theorist, the two classes of people who are intimately familiar with randomness. A check revealed I was right!

>This is a sad commentary on your education. You are lovingly taught how one theory was displaced by another, but you are seldom taught to replace a nice theory with nothing but randomness! And this is what was needed; the ability to say the theory you just read is no good and there was no definite pattern in the data, only randomness.


1. Create a tool - it takes 12 inputs and returns success: true or false at random
2. Create an agent, give it the tool. It has X attempts to use the tool and determine a working theory.
3. Track the number of tool calls to the tool. 
4. At the start of each turn check how many tool calls are left:
  1. if theres 1 tool call left, inject a user message to tell the LLM it has one call left. 
  2. if there are no more tool calls left, tell the LLM it has no more calls left and it should stop trying to find a theory.
  3. Add a guardrail that prevents the agent from being able to call the tool after X attempts. And keep telling the LLM that it has no more calls left and it should stop trying to find a theory.
5. Create an orchestrator   
  a. It runs an agent, gets the result and passes it as an input parameter to the next agent. 
  b. it should track the all of theories.
