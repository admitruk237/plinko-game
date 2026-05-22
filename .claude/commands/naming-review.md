# Naming Review

Audit naming in the current diff or specified files against `.claude/rules/naming.md`.

## Steps

1. **Identify scope**
   ```bash
   git diff --staged --name-only
   git diff --name-only
   ```
   If no args — review the diff. If a path is given — review that file.

2. **Check each file against naming rules**

   Flag any of these:
   - Generic handlers: `handleInputChange`, `handleClick`, `handleBet`, `onChange`
   - Vague state: `isPlaying`, `isLoading`, `data`, `result`, `value`, `items`
   - Negative booleans: `isDisabled`, `isManualDisabled`
   - Weak props: `min`/`max` without domain context, `onClick`/`onChange` without subject
   - Non-domain verbs where domain verbs exist: `place`/`submit` instead of `drop`, `land`

3. **Report findings**

   Format:
   ```
   file.ts:42  betInput → stakeInput   (prop name lacks domain context)
   store.ts:8  isPlaying → isBallAnimating  (vague — playing what?)
   ```

4. **Propose renames**

   List exact search→replace for each finding.
   Do not rename automatically — wait for approval unless the user says "fix it".

---

## Domain vocabulary (quick ref)

`drop` = place bet + launch ball  
`land` = ball reaches bucket  
`stake` = wager amount  
`trail` = recent results  
`slot`/`bucket` = landing pocket  
`peg` = pin on the board  
`path` = binary L/R string  
`isBallAnimating` (not `isPlaying`)  
`canDrop` (not `isDisabled`)
