# loop-pipe

loop over piped data.

## Installation

```
npm i -g loop-pipe
```

## Usage

- --verbose (debug mode, add extra logs, default:false)
- --dry (dry run will print the command and not actually run it, default:false)
- --pattern (the pattern to create the array, pass to split function, default:\n)
- --clean (you can transform the data with pattern to clean for not needed character, default:/\r?\n|\r/g)

## Example

```
echo "a,b,c" | lp --p="," "echo {v} is in location {i}"
```
