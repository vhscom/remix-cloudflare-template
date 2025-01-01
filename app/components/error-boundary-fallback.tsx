import {
  Button,
  Heading,
  DialogTrigger,
  Dialog,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryFallbackProps {
  error?: Error | null;
}

export function ErrorBoundaryFallback({ error }: ErrorBoundaryFallbackProps) {
  const navigate = useNavigate();
  const routeError = useRouteError();

  const errorMessage = isRouteErrorResponse(routeError)
    ? `${routeError.status} - ${routeError.statusText}`
    : error?.message || 'An unexpected error occurred';

  const errorDetails = isRouteErrorResponse(routeError)
    ? routeError.data?.message
    : error?.stack;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />

        <Heading className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </Heading>

        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {errorMessage}
        </p>

        <div className="mt-6 space-x-4">
          <Button
            onPress={() => {
              if (window.location.pathname === '/') {
                window.location.reload();
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back
          </Button>

          <DialogTrigger>
            <Button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View Details
            </Button>

            <ModalOverlay className="fixed inset-0 bg-black/50">
              <Modal className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6">
                <Dialog className="outline-none">
                  {({ close }) => (
                    <div>
                      <Heading className="text-lg font-medium text-gray-900 dark:text-white">
                        Error Details
                      </Heading>
                      <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto text-sm text-gray-800 dark:text-gray-200 max-h-96">
                        {errorDetails || 'No additional details available'}
                      </pre>
                      <Button
                        onPress={close}
                        className="mt-6 w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
      </div>
    </div>
  );
}
