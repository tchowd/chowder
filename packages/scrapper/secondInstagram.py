import os
import getpass
from instaloader import Instaloader, Profile

def login_to_instagram():
    # Prompt user for login credentials
    username = input("Enter your Instagram username: ")
    password = getpass.getpass("Enter your Instagram password: ")

    # Create an Instaloader instance and login
    L = Instaloader()
    L.login(username, password)

    return L

def scrape_instagram_profile(url, L):
    # Extract the profile username from the URL
    username = url.strip("/").split("/")[-1]

    # Load the profile
    profile = Profile.from_username(L.context, username)

    # Create a folder to store the images
    folder_name = "posts"
    os.makedirs(folder_name, exist_ok=True)

    # Iterate over the profile's posts
    for i, post in enumerate(profile.get_posts()):
        # Download or screenshot the post image
        image_path = os.path.join(folder_name, f"image_{i}.jpg")
        if post.is_video:
            print(f"Skipping video post {i+1}")
        else:
            try:
                L.download_pic(image_path, post.url)
                print(f"Image {i+1}/{profile.mediacount} saved.")
            except Exception as e:
                print(f"Failed to download image {i+1}: {str(e)}")

# Example usage
profile_url = "https://www.instagram.com/turja.c/"

# Login to Instagram
L = login_to_instagram()

# Scrape Instagram profile
scrape_instagram_profile(profile_url, L)
