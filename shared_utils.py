def post_to_facebook(title, summary, image_url=None):
    fb_token = os.getenv('FB_PAGE_TOKEN')
    fb_page_id = os.getenv('FB_PAGE_ID')
    
    if not summary:
        logger.error("Skipping post - no summary generated")
        return False
    
    message = f"{title}\n\n{summary}\n\n{get_random_hashtags()}"
    
    try:
        if image_url:
            # First upload the image
            image_response = requests.post(
                f'https://graph.facebook.com/{fb_page_id}/photos',
                files={'source': ('image.jpg', requests.get(image_url).content},
                data={
                    'message': message,
                    'access_token': fb_token
                }
            )
            image_response.raise_for_status()
            logger.info("Posted with image successfully")
        else:
            # Fallback to text-only post
            response = requests.post(
                f'https://graph.facebook.com/{fb_page_id}/feed',
                data={
                    'message': message,
                    'access_token': fb_token
                }
            )
            response.raise_for_status()
            logger.info("Posted text successfully")
            
        return True
    except Exception as e:
        logger.error(f"Facebook post error: {str(e)}")
        return False