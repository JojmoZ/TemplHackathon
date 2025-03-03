import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Leaf,
  Cpu,
  Palette,
  Heart,
  Users,
  LayoutGrid,
} from 'lucide-react';
import { DonationOverlay } from '@/components/donation-overlay';
import { useGetLoanPost } from '@/hooks/loan-post/use-get-loan-post';
import { useParams } from 'react-router';
import { daysLeft } from '@/lib/utils/DateString';
import { ChatAppSidebar } from '@/components/custom/chat/chat-sidebar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { MessageResponse } from '@/lib/model/dto/response/get-message-response';
import useServiceContext from '@/hooks/use-service-context';
import { useGetAuthenticated } from '@/hooks/user/use-get-authenticated';
import { useForm } from 'react-hook-form';
import { messageDto, messageSchema } from '@/lib/model/dto/send-message.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/lib/model/entity/user';
import { Principal } from '@dfinity/principal';
import { ChatButton } from '@/components/custom/chat/chat-button';

const categoryIcons = {
  All: LayoutGrid,
  Education: BookOpen,
  Environment: Leaf,
  Technology: Cpu,
  'Arts & Culture': Palette,
  Wellness: Heart,
  Community: Users,
};

const categoryColors = {
  All: 'text-blue-400',
  Education: 'text-purple-400',
  Environment: 'text-green-400',
  Technology: 'text-cyan-400',
  'Arts & Culture': 'text-pink-400',
  Wellness: 'text-red-400',
  Community: 'text-yellow-400',
};

function LoanDetailPage() {
  const { id } = useParams();
  const { loanPost, refetch } = useGetLoanPost(id ?? '');
  const [isDonationOverlayOpen, setIsDonationOverlayOpen] = useState(false);
  const { me } = useGetAuthenticated();

  const progress =
    ((loanPost?.raised ?? 0) / (loanPost?.goal ?? 0)) * 100;
  const Icon = categoryIcons[loanPost?.category as keyof typeof categoryIcons];

  const handleDonationSuccess = () => {
    refetch();
    console.log(loanPost);
    setIsDonationOverlayOpen(false); 
  };

  const form = useForm<messageDto>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
        room_id : '',
        message : '',
        created_at : BigInt(new Date().getTime()),
        user_id : me?.internetIdentity,
    },
});

  

  return (
    <div className="space-y-6">
      {!loanPost ? (
        <div>Loading...</div>
      ) : (
      <ChatAppSidebar form={form}>
        <main>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">{loanPost.title}</CardTitle>
                  
                  <div className="flex flex-col items-center gap-6">
                    
                    <div className='flex items-center'>
                      <Icon
                        className={`w-6 h-6 mr-2 ${categoryColors[loanPost.category as keyof typeof categoryColors]}`}
                      />
                      <span
                        className={`text-lg ${categoryColors[loanPost.category as keyof typeof categoryColors]}`}
                      >
                        {loanPost.category}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl mb-6">{loanPost.description}</p>
                <div className="space-y-4">
                  <Progress value={progress} className="h-4" />
                  <div className="flex justify-between text-lg">
                    <span>${loanPost.raised.toLocaleString()} raised</span>
                    <span>${loanPost.goal.toLocaleString()} goal</span>
                  </div>
                  <p className="text-muted-foreground">
                    {daysLeft(loanPost.verifiedAt, loanPost.postDuration).toLocaleString()} days left to fund this project
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setIsDonationOverlayOpen(true)}
                >
                  Support This Project
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader >
                <div className='flex justify-between items-center'>
                  <CardTitle>About This Project</CardTitle>
                  <ChatButton form={form} receiver_id={loanPost.debtor} />
                </div>
              </CardHeader>
              <CardContent>
                <p>{loanPost.description}</p>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </p>
              </CardContent>
            </Card>
            <DonationOverlay
              isOpen={isDonationOverlayOpen}
              onClose={() => setIsDonationOverlayOpen(false)}
              projectTitle={loanPost.title}
              loanId={loanPost.loanId}
              onDonationSuccess={handleDonationSuccess}
            />
        </main>
      </ChatAppSidebar>
      )}
    </div>
  );
}

export default LoanDetailPage;