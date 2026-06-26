// smoke.test.ts
import { loginUser, uploadImage, generateVideoWithFal, viewGallery } from '../lib/services';
import mockData from './fixtures/mockData';

describe('AI Video Smoke Flow', () => {
  it('should complete end-to-end AI video generation flow', async () => {
    // 1. User Login
    const user = await loginUser({ username: 'testUser', password: 'securePass' });
    expect(user).toHaveProperty('token');

    // 2. Upload Image
    const uploadResult = await uploadImage(user.token, mockData.imageFile);
    expect(uploadResult).toHaveProperty('imageUrl');

    // 3. Generate AI Video
    const videoResult = await generateVideoWithFal({
      token: user.token,
      imageUrl: uploadResult.imageUrl,
      prompt: 'fashion style showcase'
    });
    expect(videoResult).toHaveProperty('videoUrl');
    expect(videoResult.caption).toMatch(/fashion|style|trend/i);

    // 4. View Gallery
    const gallery = await viewGallery(user.token);
    expect(gallery).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ videoUrl: videoResult.videoUrl })
      ])
    );
  });
});