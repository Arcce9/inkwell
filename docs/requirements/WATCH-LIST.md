# docs/requirements/WATCH-LIST.md
| Requirement | Watch for | Status as of Lecture 3 |
|---|---|---|
| US-03's negotiated MVP scope. This section talks about a deal already 
agreed on. The deal set the first-version scope, or MVP, for editing po
sts. | Watch for feedback from the Author. The feedback would say plain-text editing is not good enough. This feedback has not happened yet. I
t is only a real concern once it actually happens. | No signal yet. Not
hing has come up so far. Keep watching once Lectures 6 and 7 ship. Ship
ping means the feature goes live. |
| Register and Login non-enumeration extensions. Non-enumeration means the system does not reveal which emails are already registered. | Watch 
for any future feature that breaks this rule by accident. One example i
s a "check if email exists" endpoint. An endpoint is a piece of the sys
tem that answers a specific request. This kind of endpoint would leak i
nformation it shouldn't. | Clear for now. No such endpoint exists yet. 
|
| Post behavioral model. This model shows the different states a Post c
an be in. | Watch for any future feature that assumes a Post state not 
shown in this model. One example is comments. Comments are planned for 
Lecture 3, Exercise 5. | Open. This is not fully settled yet. The Comme
nt feature's own model has not been written. That will happen in Exerci
se 6. |