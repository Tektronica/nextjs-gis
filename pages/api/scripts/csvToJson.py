import csv
import json


# https://www.geeksforgeeks.org/how-to-read-a-local-text-file-using-javascript/
# http://www.convertcsv.com/csv-to-json.htm

# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath):
    # create a dictionary
    data = []

    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        # Convert each row into a dictionary
        # and add it to data
        for row in csvReader:
            data.append(row)
            # data[key] = rows

    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


# Driver Code

# Decide the two file paths according to your
# computer system
PARENT_DIRECTORY = 'C:/Users/rholle/Documents/projects/tool-scripts'
csvFilePath = PARENT_DIRECTORY + r'/airports.csv'
jsonFilePath = PARENT_DIRECTORY + r'/airports.json'

# Call the make_json function
make_json(csvFilePath, jsonFilePath)
