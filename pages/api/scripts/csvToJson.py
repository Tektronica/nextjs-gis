import pandas as pd
import json

PARENT_DIRECTORY = 'C:/Users/rholle/Documents/projects/tool-scripts'
csvFilePath = PARENT_DIRECTORY + r'/airports.csv'
jsonFilePath = PARENT_DIRECTORY + r'/airports.json'


# https://www.geeksforgeeks.org/how-to-read-a-local-text-file-using-javascript/
# http://www.convertcsv.com/csv-to-json.htm
# https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html
# https://stackoverflow.com/a/26181135/3382269
# https://stackoverflow.com/a/19732660/3382269
# https://stackoverflow.com/a/28390992/3382269

# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvPath, jsonPath):
    # build pandas dataFrame from csv file
    df = pd.read_csv(csvPath)

    # SyntaxError: Unexpected token N is often the result of accidentally returning a NaN in your JSON
    df = df.fillna('')

    # while pandas can format as json, there is no line break structure
    jsonData = df.to_dict('records')

    # export dataFrame as json
    with open(jsonPath, 'w') as f:
        f.write(json.dumps(jsonData, indent=4))


# Call the make_json function
if __name__ == "__main__":
    make_json(csvFilePath, jsonFilePath)
