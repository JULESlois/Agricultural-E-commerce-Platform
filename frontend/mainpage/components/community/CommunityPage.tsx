import React, { useState } from 'react';
import SimplifiedHeader from '../shared/SimplifiedHeader';
import Footer from '../Footer';
import type { Post } from '../../types';
import { posts, users } from '../../data/communityData';

const CreatePostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
// FIX: The `fillRule` attribute does not accept "none" as a value. 
// Changed to always be "evenodd" as it's only relevant when the path is filled.
const LikeIcon = ({ liked }: { liked?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${liked ? 'text-red-500 fill-current' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>;
const CommentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.962 8.962 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.832 15.023L5.736 12.5A6.983 6.983 0 004 10c0-2.899 2.582-5.25 6-5.25s6 2.351 6 5.25-2.582 5.25-6 5.25a7.001 7.001 0 00-2.585-.43l-1.583.504z" clipRule="evenodd" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>;

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [liked, setLiked] = useState(false);
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start space-x-3">
                <img src={post.user.avatarUrl} alt={post.user.name} className="w-12 h-12 rounded-full" />
                <div>
                    <p className="font-bold text-gray-800">{post.user.name}</p>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
            </div>
            <p className="my-4 text-gray-700 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post content" className="rounded-lg w-full max-h-[400px] object-cover" />
            )}
            <div className="mt-4 flex justify-around border-t pt-2">
                <button onClick={() => setLiked(!liked)} className="flex items-center space-x-1 text-gray-600 hover:text-red-500 rounded-md p-2 hover:bg-red-50 transition">
                    <LikeIcon liked={liked} /> <span>{post.likes + (liked ? 1 : 0)}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 rounded-md p-2 hover:bg-blue-50 transition">
                    <CommentIcon /> <span>{post.comments.length}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 rounded-md p-2 hover:bg-green-50 transition">
                    <ShareIcon /> <span>分享</span>
                </button>
            </div>
        </div>
    );
};

const CreatePost: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <textarea className="w-full border-none focus:ring-0 resize-none p-2" rows={3} placeholder="分享您的农事、经验和问题..."></textarea>
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <button className="text-gray-500 hover:text-green-600"><ImageIcon/></button>
                <button className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition">发布</button>
            </div>
        </div>
    );
}

const CommunityPage: React.FC<{ navigate: (page: string) => void }> = ({ navigate }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <SimplifiedHeader navigate={navigate} pageTitle="用户社区" />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-1 hidden lg:block">
                       <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
                           <h3 className="font-bold text-lg mb-4">导航</h3>
                           <ul className="space-y-2 text-gray-700">
                               <li><a href="#" className="font-bold text-green-600">动态首页</a></li>
                               <li><a href="#" className="hover:text-green-600">热门话题</a></li>
                               <li><a href="#" className="hover:text-green-600">专家问答</a></li>
                           </ul>
                           <button className="mt-4 w-full flex items-center justify-center bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition">
                                <CreatePostIcon/>
                                写点什么
                            </button>
                       </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-2">
                        <CreatePost/>
                        <div className="space-y-6">
                           {posts.map(post => <PostCard key={post.id} post={post} />)}
                        </div>
                    </main>

                    {/* Right Sidebar */}
                     <aside className="lg:col-span-1 hidden lg:block">
                       <div className="bg-white rounded-lg shadow-md p-4 sticky top-24 space-y-6">
                           <div>
                                <h3 className="font-bold text-lg mb-4">热门话题</h3>
                                <ul className="space-y-2 text-sm text-blue-600">
                                    <li><a href="#" className="hover:underline">#农业技术</a></li>
                                    <li><a href="#" className="hover:underline">#我的农场日记</a></li>
                                    <li><a href="#" className="hover:underline">#病虫害防治</a></li>
                                    <li><a href="#" className="hover:underline">#农产品价格</a></li>
                                </ul>
                           </div>
                           <div>
                                <h3 className="font-bold text-lg mb-4">推荐关注</h3>
                                <ul className="space-y-3">
                                   {Object.values(users).slice(0, 3).map(user => (
                                     <li key={user.id} className="flex items-center space-x-3">
                                       <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                       <div>
                                           <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                                           <p className="text-xs text-gray-500">{user.handle}</p>
                                       </div>
                                     </li>
                                   ))}
                                </ul>
                           </div>
                       </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CommunityPage;
