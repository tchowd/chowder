import os
import time
import getpass
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from PIL import Image
from urllib.parse import urlparse

# Set up Selenium
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run Chrome in headless mode (without opening the browser window)
driver = webdriver.Chrome()

def login_to_instagram():
    # Open Instagram login page
    driver.get("https://www.instagram.com/accounts/login/")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "username")))

    # Prompt user for login credentials
    username = input("Enter your Instagram username: ")
    password = getpass.getpass("Enter your Instagram password: ")

    # Fill in login form and submit
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # Wait for login process to complete
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "article")))

def scrape_instagram_profile(url):
    # Create a folder to store the images
    folder_name = "posts"
    os.makedirs(folder_name, exist_ok=True)

    # Extract the profile username from the URL
    parsed_url = urlparse(url)
    username = parsed_url.path.strip("/")

    # Construct the correct URL for scraping
    base_url = f"https://www.instagram.com/{username}/"

    # Open the Instagram profile in the browser
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "article")))

    # Scroll down to load more posts (adjust the number of scrolls as per your requirement)
    num_scrolls = 3
    for _ in range(num_scrolls):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

    # Get the page source after scrolling
    page_source = driver.page_source

    # Parse the page source with BeautifulSoup
    soup = BeautifulSoup(page_source, "html.parser")

    # Find all image elements
    image_elements = soup.find_all("img")

    # Download and save each image
    for i, image_element in enumerate(image_elements):
        image_url = image_element["src"]
        image_data = requests.get(image_url).content

        # Save the image to the folder
        image_path = os.path.join(folder_name, f"image_{i}.jpg")
        with open(image_path, "wb") as file:
            file.write(image_data)

        # Resize the image (optional)
        image = Image.open(image_path)
        resized_image = image.resize((800, 800))
        resized_image.save(image_path)

        print(f"Image {i+1}/{len(image_elements)} saved.")

    # Close the browser
    driver.quit()

# Example usage
profile_url = "https://instagram.com/turja.c"

# Login to Instagram
login_to_instagram()

# Scrape Instagram profile
scrape_instagram_profile(profile_url)
